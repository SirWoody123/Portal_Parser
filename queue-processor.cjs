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
const COL = {
  STATUS:           0,  // A
  COMPANY_ID:       1,  // B
  INDUSTRY:         2,  // C
  OPPORTUNITY:      3,  // D
  DATE:             4,  // E
  LINK:             5,  // F
  LOCATION:         6,  // G
  PUBLISH_DATE:     7,  // H
  OPP_NAME:         8,  // I
  DRAFTED_CONTENT:  9,  // J
  DEMOGRAPHICS:     10, // K
  DRAFTED_DATE:     11, // L
  ERROR_NOTES:      12, // M
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
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
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

// ─── Claude extraction ────────────────────────────────────────────────────────

const CLAUDE_SYSTEM_PROMPT = `You are a copywriting assistant trained to extract key information for creative career opportunities for young people aged 16–25.

You will be given:
- Pre-verified fields (industry, opportunity type, deadline, location) — treat these as FIXED. Do NOT re-extract or change them.
- The raw webpage content of the opportunity.

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

CRITICAL RULES:
- If you cannot determine a value, write 'Unclear' — never guess or fabricate.
- For demographics: only narrow from the defaults if the opportunity explicitly targets specific groups.
- For disability: if neurodivergent/autistic/ADHD/dyslexic is mentioned → 'Neurodiversity'. If wheelchair/blind/deaf → 'Physical disability'. If mental health/anxiety/depression → 'Mental health'. If chronic illness → 'Chronic illness'. Only use 'All disability' when nothing specific is mentioned.
- For gender: if explicitly for women → She/Her. If LGBTQIA+ related → LGBTQIA+. Only 'All genders & preferences' when nothing specific.

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
  "region": ["..."]
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

function formatDraftedContent(row, extracted) {
  return [
    `Category: ${row.opportunity}`,
    ``,
    `${extracted.description || ''}`,
    ``,
    `Application deadline: ${row.date}`,
    `Location: ${row.location}`,
    `Link: ${row.link}${row.link.includes('?') ? '&' : '?'}utm_source=www.meet-eric.com`,
    extracted.anythingElseImportant ? `\nAnything else important: ${extracted.anythingElseImportant}` : '',
  ].filter(l => l !== undefined).join('\n').trim();
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
      range: `${QUEUE_TAB}!A2:M1000`,
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
      // Fetch page content
      const pageContent = link ? await fetchUrlContent(link) : null;

      // Build row object for Claude
      const rowData = {
        industry:    (row[COL.INDUSTRY] || '').trim(),
        opportunity: (row[COL.OPPORTUNITY] || '').trim(),
        date:        (row[COL.DATE] || '').trim(),
        link,
        location:    (row[COL.LOCATION] || '').trim(),
        pageContent: pageContent ? pageContent.substring(0, 30000) : '', // cap at 30k chars
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

      // Write results back to the sheet row
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${QUEUE_TAB}!A${rowIndex}:M${rowIndex}`,
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
            demographics,                      // K - Demographics
            draftedDate,                       // L - Drafted Date
            '',                                // M - Error Notes (clear any old errors)
          ]],
        },
      });

      console.log(`✅ QUEUE: Row ${rowIndex} processed → Ready for Review (${finalOppName})`);

    } catch (err) {
      console.error(`❌ QUEUE: Error processing row ${rowIndex}:`, err.message);

      // Mark as error and log the message
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${QUEUE_TAB}!A${rowIndex}:M${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            STATUS.TO_UPLOAD,     // A - Reset to To upload so it can be retried
            ...Array(11).fill(''),
            err.message,          // M - Error Notes
          ]],
        },
      });
    }
  }

  console.log('✅ QUEUE: Batch complete.');
}

// ─── Exports ──────────────────────────────────────────────────────────────────

function startQueueProcessor() {
  console.log('⏱ QUEUE PROCESSOR: Starting — will check every 15 minutes.');
  // Run immediately on start, then every 15 minutes
  processQueue();
  cron.schedule('*/15 * * * *', processQueue);
}

module.exports = { startQueueProcessor, processQueue };
