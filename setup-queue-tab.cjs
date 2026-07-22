/**
 * setup-queue-tab.cjs
 * Run once to set up the Queue tab in the spreadsheet:
 *   - Adds column headers
 *   - Adds Status dropdown validation
 *   - Freezes the header row
 *   - Bolds the header row
 *
 * Usage: node setup-queue-tab.cjs
 * Requires env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
 */

require('dotenv').config();
const { google } = require('googleapis');

const SPREADSHEET_ID = '1N05E3Tahh9APAA-vysvD3HlP3ChISTgPwao9Te5mW18';
const QUEUE_TAB_NAME = 'Queue';

const HEADERS = [
  'Status',
  'Company ID',
  'Industry',
  'Opportunity',
  'Date',
  'Link',
  'Location',
  'Publish Date',
  'Opp Name',
  'Drafted Content',
  'Demographics',
  'Drafted Date',
  'Error Notes'
];

const STATUS_OPTIONS = [
  'To upload',
  'Processing',
  'Ready for Review',
  'Drafted',
  'Rejected'
];

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

async function getSheetId(sheets) {
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = res.data.sheets.find(s => s.properties.title === QUEUE_TAB_NAME);
  if (!sheet) throw new Error(`Sheet "${QUEUE_TAB_NAME}" not found. Please create it first in Google Sheets.`);
  return sheet.properties.sheetId;
}

async function setup() {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('🔍 Finding Queue tab...');
  const sheetId = await getSheetId(sheets);
  console.log(`✅ Found Queue tab (sheetId: ${sheetId})`);

  // 1. Write headers to row 1
  console.log('📝 Writing headers...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${QUEUE_TAB_NAME}!A1:M1`,
    valueInputOption: 'RAW',
    requestBody: { values: [HEADERS] },
  });

  // 2. Batch formatting requests
  const requests = [
    // Bold + background the header row
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
            backgroundColor: { red: 0.204, green: 0.204, blue: 0.204 },
          },
        },
        fields: 'userEnteredFormat(textFormat,backgroundColor)',
      },
    },
    // Freeze header row
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
        fields: 'gridProperties.frozenRowCount',
      },
    },
    // Status dropdown on column A (rows 2–1000)
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: 1 },
        rule: {
          condition: {
            type: 'ONE_OF_LIST',
            values: STATUS_OPTIONS.map(v => ({ userEnteredValue: v })),
          },
          showCustomUi: true,
          strict: true,
        },
      },
    },
    // Widen columns: Status(A), Link(F), Drafted Content(J), Demographics(K)
    ...[
      { index: 0, width: 140 },  // Status
      { index: 1, width: 120 },  // Company ID
      { index: 2, width: 160 },  // Industry
      { index: 3, width: 160 },  // Opportunity
      { index: 4, width: 120 },  // Date
      { index: 5, width: 280 },  // Link
      { index: 6, width: 140 },  // Location
      { index: 7, width: 130 },  // Publish Date
      { index: 8, width: 220 },  // Opp Name
      { index: 9, width: 400 },  // Drafted Content
      { index: 10, width: 300 }, // Demographics
      { index: 11, width: 130 }, // Drafted Date
      { index: 12, width: 250 }, // Error Notes
    ].map(({ index, width }) => ({
      updateDimensionProperties: {
        range: { sheetId, dimension: 'COLUMNS', startIndex: index, endIndex: index + 1 },
        properties: { pixelSize: width },
        fields: 'pixelSize',
      },
    })),
  ];

  console.log('🎨 Applying formatting and validation...');
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests },
  });

  console.log('✅ Queue tab setup complete!');
  console.log('   Headers:   A1:M1 written');
  console.log('   Dropdown:  Status column (To upload / Processing / Ready for Review / Drafted / Rejected)');
  console.log('   Frozen:    Row 1');
}

setup().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
