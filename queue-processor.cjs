/**
 * queue-processor.cjs
 * Cron job that polls the Queue tab for rows with Status = "To upload",
 * fetches the URL, calls Claude to extract missing fields (description,
 * demographics, friendly name), and writes results back to the sheet.
 *
 * Intended to be required by api-server.cjs and started with startQueueProcessor().
 */

'use strict';

const cron = require('node-cron');
const { google } = require('googleapis');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

// ─── Config ──────────────────────────────────────────────────────────────────

const SPREADSHEET_ID = '1N05E3Tahh9APAA-vysvD3HlP3ChISTgPwao9Te5mW18';
const QUEUE_TAB = 'Queue';

// Column indices (0-based), matching the header row written by setup-queue-tab.cjs
// (N-W added by the one-off /admin/add-queue-columns-nw endpoint, X-AE by
// /admin/add-demographics-columns)
const COL = {
  STATUS:                    0,  // A
  COMPANY_ID:                1,  // B
  INDUSTRY:                  2,  // C
  OPPORTUNITY:               3,  // D
  DATE:                      4,  // E
  LINK:                      5,  // F
  LOCATION:                  6,  // G
  PUBLISH_DATE:              7,  // H
  OPP_NAME:                  8,  // I
  DRAFTED_CONTENT:           9,  // J
  DEMOGRAPHICS:              10, // K
  DRAFTED_DATE:              11, // L
  ERROR_NOTES:               12, // M
  ANYTHING_ELSE_IMPORTANT:   13, // N
  SALARY:                    14, // O
  LENGTH_OF_COURSE:          15, // P
  PAID_OR_FREE_COURSES:      16, // Q
  COURSE_LOCATION:           17, // R
  LENGTH_OF_APPRENTICESHIP:  18, // S
  LEVEL_OF_APPRENTICESHIP:   19, // T
  EVENT_DATE:                20, // U
  EVENT_START_TIME:          21, // V
  EVENT_END_TIME:            22, // W
  AGE:                       23, // X
  GENDER:                    24, // Y
  ETHNICITY:                 25, // Z
  DISABILITY:                26, // AA
  ECONOMIC_BACKGROUND:       27, // AB
  REMOTE:                    28, // AC
  UK_WIDE:                   29, // AD
  REGION:                    30, // AE
};

const STATUS = {
  TO_UPLOAD:        'To upload',
  PROCESSING:       'Processing',
  READY_FOR_REVIEW: 'Ready for Review',
  DRAFTED:          'Drafted',
  REJECTED:         'Rejected',
};

// ─── Google Sheets auth ───────────────────────────────────────────────────────

function getSheetsClient() {
  let credentials;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    // Most reliable approach for Railway — decode base64 JSON
    console.log('🔑 QUEUE: Using GOOGLE_SERVICE_ACCOUNT_BASE64 credentials.');
    credentials = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
  } else {
    // Fallback for local .env
    console.log('🔑 QUEUE: GOOGLE_SERVICE_ACCOUNT_BASE64 not set — falling back to GOOGLE_PRIVATE_KEY.');
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) privateKey = privateKey.slice(1, -1);
    privateKey = privateKey.replace(/\\n/g, '\n');

    // If the key looks like JSON (full service account), parse it
    if (privateKey.trim().startsWith('{')) {
      console.log('🔑 QUEUE: GOOGLE_PRIVATE_KEY is JSON — parsing full service account.');
      try {
        credentials = JSON.parse(privateKey);
      } catch (e) {
        // If JSON parse fails, the private_key field likely has literal newlines instead of \n.
        // Find and escape them: look for -----BEGIN...-----END wrapped in quotes with unescaped newlines
        console.log('🔑 QUEUE: JSON parse failed, trying to fix literal newlines...');
        const fixedKey = privateKey.replace(/"-----BEGIN[\s\S]*?-----END[^"]*"/g, (match) => {
          return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        });
        credentials = JSON.parse(fixedKey);
      }
    } else {
      // PEM format key
      credentials = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      };
    }
  }
  console.log('🔑 QUEUE: client_email:', credentials.client_email, '| key starts with:', JSON.stringify((credentials.private_key || '').slice(0, 30)), '| key length:', (credentials.private_key || '').length);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

// ─── Fetch URL content ────────────────────────────────────────────────────────

async function fetchUrlContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      },
      validateStatus: () => true, // never throw on HTTP errors
    });
    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  } catch (err) {
    console.error(`❌ QUEUE: Failed to fetch ${url}:`, err.message);
    return null;
  }
}

// ─── Clean fetched HTML before sending to Claude ─────────────────────────────

// Many source sites (Eventbrite, job boards) embed exact machine-readable event/job
// data as schema.org JSON-LD for SEO — startDate/endDate/offers.price etc. Pull it out
// and surface it separately so it isn't buried in 30k chars of raw markup noise.
function extractStructuredData(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const raw = match[1].trim();
    if (raw) blocks.push(raw);
  }
  return blocks;
}

// Strips tags/scripts/styles down to visible text — same underlying content survives,
// but the char budget sent to Claude stops being ~80% CSS/JS noise.
function stripHtmlNoise(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanPageContent(html) {
  if (!html) return '';
  const structuredBlocks = extractStructuredData(html);
  const visibleText = stripHtmlNoise(html);
  if (structuredBlocks.length === 0) return visibleText;
  return [
    'STRUCTURED DATA FOUND ON PAGE (schema.org JSON-LD — treat as ground truth for dates/times/price when present, it is the same data search engines read):',
    structuredBlocks.join('\n---\n'),
    '',
    'VISIBLE PAGE TEXT:',
    visibleText,
  ].join('\n');
}

// ─── Claude extraction ────────────────────────────────────────────────────────

const CLAUDE_SYSTEM_PROMPT = `You are a copywriting assistant trained to extract key information for creative career opportunities for young people aged 16–25.

You will be given:
- Pre-verified fields (industry, opportunity type, deadline, location) — treat these as FIXED. Do NOT re-extract or change them.
- The webpage content of the opportunity, with HTML markup stripped down to text. If the page embeds schema.org structured data (JSON-LD — the same machine-readable data search engines index), it appears first in a clearly labelled STRUCTURED DATA section before the visible text. When present, treat it as ground truth for exact dates, times, and prices (e.g. its startDate/endDate/offers.price fields) rather than inferring from prose — it's more reliable than free text.

Your job is ONLY to extract/generate the following missing fields:
1. Opp Name: A friendly name, 2–4 words, hyphen-separated. Must include something unique — prioritise company/brand/venue name. e.g. 'BBC-Writing-Internship', 'Roundhouse-Music-Course'. Never use generic names like 'Creative-Opportunity'.
2. Description: A clear, engaging 2–4 sentence summary of the opportunity written for young creatives aged 16–25. Friendly, informative tone.
3. Anything else important: Eligibility criteria, salary/cost, specific dates, perks, requirements.
4. Demographics - Age: From: All ages, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, Over 18, Under 18, Over 25, 16 and under. If not specified default to: All ages, Over 18, Under 18, Over 25
5. Demographics - Gender & Sexual Preference: From: All genders & preferences, He/Him, LGBTQIA+, She/Her, They/Them. If not specified default to ALL options.
6. Demographics - Ethnicity: From: All ethnicities, African Caribbean or Black British, Arab, Asian or Asian British, Mixed or Multiple Ethnic Group, Other Ethnic Group, White or White British. If not specified default to ALL options.
7. Demographics - Disability: From: All disability, Chronic illness, Mental health, Neurodiversity, Physical disability. If not specified default to ALL options.
8. Demographics - Economic Background: From: All backgrounds, Only those from lower socio-economic background. If not specified default to All backgrounds.
9. Remote: Yes or No.
10. UK Wide: Yes or No.
11. Region: One or more from: North East, North West, Yorkshire and the Humber, East Midlands, West Midlands, East of England, London, South East, South West, Wales, Scotland, Northern Ireland. If remote or UK-wide select all. If in-person at a specific location select ONLY that region.
12. Salary: The pay/stipend/cost to the applicant, as stated (e.g. '£20,000', 'Unpaid', 'Free'). Applies to every opportunity type. Check structured data's offers/price fields first if present.
13. Length of course: ONLY if Opportunity type is "Course" — e.g. '6 weeks'. Empty string for any other type.
14. Paid or free (course): ONLY if Opportunity type is "Course" — e.g. 'Free', 'Paid'. Empty string for any other type.
15. Course location: ONLY if Opportunity type is "Course" — e.g. online, or a specific venue if different from the general Location field. Empty string for any other type.
16. Length of apprenticeship: ONLY if Opportunity type is "Apprenticeship" — e.g. '18 months'. Empty string for any other type.
17. Level of apprenticeship: ONLY if Opportunity type is "Apprenticeship" — e.g. 'Level 4'. Empty string for any other type.
18. Event date: ONLY if Opportunity type is "Event" — the date the event takes place, DD/MM/YYYY if determinable. Check structured data's startDate first if present. Default to the same date as the pre-verified Deadline field unless the page clearly states a genuinely different date (e.g. "apply by 15th, event happens on the 20th") — for a one-off event, the deadline and the event date are almost always the same day. Empty string for any other type.
19. Event start time: ONLY if Opportunity type is "Event" — strict 24-hour "HH:MM", e.g. '18:00' for 6pm, '09:15' for 9:15am. The real portal's time picker rejects anything else. Check structured data's startDate first if present. Empty string for any other type.
20. Event end time: ONLY if Opportunity type is "Event" — strict 24-hour "HH:MM", same format as Event start time. Check structured data's endDate first if present. Empty string for any other type.

CRITICAL RULES:
- If you cannot determine a value, write 'Unclear' — never guess or fabricate.
- For demographics: only narrow from the defaults if the opportunity explicitly targets specific groups.
- For disability: if neurodivergent/autistic/ADHD/dyslexic is mentioned → 'Neurodiversity'. If wheelchair/blind/deaf → 'Physical disability'. If mental health/anxiety/depression → 'Mental health'. If chronic illness → 'Chronic illness'. Only use 'All disability' when nothing specific is mentioned.
- For gender: if explicitly for women → She/Her. If LGBTQIA+ related → LGBTQIA+. Only 'All genders & preferences' when nothing specific.
- For fields 13-20: these are type-specific. If the opportunity type given to you doesn't match the field's type, return an empty string '' for it — never 'Unclear', never a value borrowed from a different type.

Output ONLY valid JSON. No markdown, no explanation, no extra text.`;

function buildClaudeUserPrompt(row) {
  return `Here are the pre-verified fields — DO NOT change these:
- Industry: ${row.industry}
- Opportunity type: ${row.opportunity}
- Deadline: ${row.date}
- Location: ${row.location}
- Link: ${row.link}

Here is the webpage content:
---
${row.pageContent || 'Could not fetch page content.'}
---

Return JSON with exactly these keys:
{
  "oppName": "...",
  "description": "...",
  "anythingElseImportant": "...",
  "age": ["..."],
  "genderSexualPreference": ["..."],
  "ethnicity": ["..."],
  "disability": ["..."],
  "economicBackground": ["..."],
  "remote": "Yes" or "No",
  "ukWide": "Yes" or "No",
  "region": ["..."],
  "salary": "...",
  "lengthOfCourse": "...",
  "paidOrFreeCourses": "...",
  "courseLocation": "...",
  "lengthOfApprenticeship": "...",
  "levelOfApprenticeship": "...",
  "eventDate": "...",
  "eventStartTime": "...",
  "eventEndTime": "..."
}`;
}

async function extractWithClaude(row) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    system: CLAUDE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildClaudeUserPrompt(row) }],
  });

  const text = message.content[0]?.text || '';

  // Strip any accidental markdown fences
  const jsonText = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(jsonText);
}

// ─── Format demographics for the sheet cell ──────────────────────────────────

function formatDemographics(extracted) {
  const lines = [
    `Age: ${(extracted.age || []).join(', ')}`,
    `Gender: ${(extracted.genderSexualPreference || []).join(', ')}`,
    `Ethnicity: ${(extracted.ethnicity || []).join(', ')}`,
    `Disability: ${(extracted.disability || []).join(', ')}`,
    `Economic Background: ${(extracted.economicBackground || []).join(', ')}`,
    `Remote: ${extracted.remote || 'No'}`,
    `UK Wide: ${extracted.ukWide || 'No'}`,
    `Region: ${(extracted.region || []).join(', ')}`,
  ];
  return lines.join('\n');
}

// ─── Format drafted content for the sheet cell ───────────────────────────────

// This becomes the review app's "Short summary" field, and from there flows straight through
// to the real portal's public description — it used to also bundle Category/Application
// deadline/Location/Link into the same text, which now duplicate the review app's own
// dedicated fields for those and were never meant to be public-facing copy. Just the clean
// description now. `anythingElseImportant` gets its own column (N) instead — see processQueue().
function formatDraftedContent(row, extracted) {
  return (extracted.description || '').trim();
}

// ─── Main processor ───────────────────────────────────────────────────────────

async function processQueue() {
  console.log('⏱ QUEUE: Starting queue check...');
  const sheets = getSheetsClient();

  // Read all rows from Queue tab
  let rows;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${QUEUE_TAB}!A2:AE1000`,
    });
    rows = res.data.values || [];
  } catch (err) {
    console.error('❌ QUEUE: Failed to read sheet:', err.message);
    return;
  }

  const toProcess = rows
    .map((row, i) => ({ rowIndex: i + 2, row })) // +2 because data starts at row 2
    .filter(({ row }) => (row[COL.STATUS] || '').trim() === STATUS.TO_UPLOAD);

  if (toProcess.length === 0) {
    console.log('✅ QUEUE: No rows to process.');
    return;
  }

  console.log(`📋 QUEUE: Found ${toProcess.length} row(s) to process.`);

  for (const { rowIndex, row } of toProcess) {
    const link = (row[COL.LINK] || '').trim();
    const oppName = (row[COL.OPP_NAME] || '').trim();

    console.log(`🔄 QUEUE: Processing row ${rowIndex}: ${link}`);

    // Mark as Processing immediately to prevent double-processing
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${QUEUE_TAB}!A${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[STATUS.PROCESSING]] },
    });

    try {
      // Fetch page content and strip it down to text (+ any schema.org structured
      // data) before it eats into the char budget Claude actually reads.
      const pageContent = link ? await fetchUrlContent(link) : null;
      const cleanedContent = pageContent ? cleanPageContent(pageContent) : null;

      // Build row object for Claude
      const rowData = {
        industry:    (row[COL.INDUSTRY] || '').trim(),
        opportunity: (row[COL.OPPORTUNITY] || '').trim(),
        date:        (row[COL.DATE] || '').trim(),
        link,
        location:    (row[COL.LOCATION] || '').trim(),
        pageContent: cleanedContent ? cleanedContent.substring(0, 30000) : '', // cap at 30k chars
      };

      // Call Claude
      const extracted = await extractWithClaude(rowData);

      const draftedContent  = formatDraftedContent(rowData, extracted);
      const demographics    = formatDemographics(extracted);
      const now             = new Date();
      const dateSuffix      = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).replace(' ', '').replace(' ', ''); // e.g. 22Jul
      const timeSuffix      = now.toTimeString().slice(0, 5).replace(':', ''); // e.g. 1430
      const baseName        = oppName || extracted.oppName || 'Unnamed';
      const pageAccessFailed = !pageContent ||
        (extracted.description || '').toLowerCase().includes('could not be accessed') ||
        (extracted.description || '').toLowerCase().includes('unable to access') ||
        (extracted.description || '').toLowerCase().includes('server error') ||
        (extracted.description || '').trim().toLowerCase().startsWith('unclear');
      const finalOppName    = `${baseName}-${dateSuffix}-${timeSuffix}${pageAccessFailed ? ' [Check]' : ''}`;
      const draftedDate     = now.toLocaleDateString('en-GB');

      // Enforced in code, not just prompted — only persist type-specific fields for the
      // row's actual opportunity type, regardless of what Claude returned.
      const isCourse        = rowData.opportunity === 'Course';
      const isApprenticeship = rowData.opportunity === 'Apprenticeship';
      const isEvent          = rowData.opportunity === 'Event';

      // Write results back to the sheet row
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${QUEUE_TAB}!A${rowIndex}:AE${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            STATUS.READY_FOR_REVIEW,           // A - Status
            row[COL.COMPANY_ID] || '',         // B - Company ID (unchanged)
            row[COL.INDUSTRY] || '',           // C - Industry (unchanged)
            row[COL.OPPORTUNITY] || '',        // D - Opportunity (unchanged)
            row[COL.DATE] || '',               // E - Date (unchanged)
            row[COL.LINK] || '',               // F - Link (unchanged)
            row[COL.LOCATION] || '',           // G - Location (unchanged)
            row[COL.PUBLISH_DATE] || '',       // H - Publish Date (unchanged)
            finalOppName,                      // I - Opp Name
            draftedContent,                    // J - Drafted Content
            demographics,                      // K - Demographics (readable summary, kept for quick sheet-side reading)
            draftedDate,                       // L - Drafted Date
            '',                                // M - Error Notes (clear any old errors)
            extracted.anythingElseImportant || '',                        // N
            extracted.salary || '',                                       // O
            isCourse ? (extracted.lengthOfCourse || '') : '',             // P
            isCourse ? (extracted.paidOrFreeCourses || '') : '',          // Q
            isCourse ? (extracted.courseLocation || '') : '',             // R
            isApprenticeship ? (extracted.lengthOfApprenticeship || '') : '', // S
            isApprenticeship ? (extracted.levelOfApprenticeship || '') : '', // T
            isEvent ? (extracted.eventDate || '') : '',                   // U
            isEvent ? (extracted.eventStartTime || '') : '',              // V
            isEvent ? (extracted.eventEndTime || '') : '',                // W
            (extracted.age || []).join(', '),                             // X
            (extracted.genderSexualPreference || []).join(', '),          // Y
            (extracted.ethnicity || []).join(', '),                       // Z
            (extracted.disability || []).join(', '),                      // AA
            (extracted.economicBackground || []).join(', '),              // AB
            extracted.remote || 'No',                                     // AC
            extracted.ukWide || 'No',                                     // AD
            (extracted.region || []).join(', '),                          // AE
          ]],
        },
      });

      console.log(`✅ QUEUE: Row ${rowIndex} processed → Ready for Review (${finalOppName})`);

    } catch (err) {
      console.error(`❌ QUEUE: Error processing row ${rowIndex}:`, err.message);

      // Mark as error and log the message
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${QUEUE_TAB}!A${rowIndex}:AE${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            STATUS.TO_UPLOAD,     // A - Reset to To upload so it can be retried
            ...Array(11).fill(''), // B-L
            err.message,           // M - Error Notes
            ...Array(18).fill(''), // N-AE
          ]],
        },
      });
    }
  }

  console.log('✅ QUEUE: Batch complete.');
}

// ─── Exports ──────────────────────────────────────────────────────────────────

function startQueueProcessor() {
  console.log('⏱ QUEUE PROCESSOR: Starting — will check at 4am and 9am UK time daily.');
  // Run immediately on start, then on a UK-anchored schedule. 4am gives extraction (and the
  // publish scheduler, see api-server.cjs) hours of runway before Phoebe's ~8am login; 9am is
  // a second pass for anything added to the Backlog/Queue overnight or missed by the first run.
  // Europe/London (not a fixed UTC offset) so this stays correct across the GMT/BST switch.
  processQueue();
  cron.schedule('0 4,9 * * *', processQueue, { timezone: 'Europe/London' });
}

module.exports = { startQueueProcessor, processQueue };
