/* eslint-disable linebreak-style */
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

let doc;

/**
 * Lazy initialization of Google Sheets doc
 */
async function initDoc() {
  if (doc) return doc;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !privateKey || !sheetId) {
    if (process.env.NODE_ENV === 'test') {
      // In test mode, we might be mocking GoogleSpreadsheet anyway
      doc = new GoogleSpreadsheet(sheetId || 'test-id', { email: 'test', key: 'test' });
      return doc;
    }
    throw new Error('[GoogleSheets] Missing environment variables for Google Sheets authentication.');
  }

  const serviceAccountAuth = new JWT({
    email,
    key: privateKey.split(String.raw`\n`).join('\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  return doc;
}

/**
 * @param {*} index
 */
async function getSheet(index) {
  const d = await initDoc();
  await d.loadInfo();
  return d.sheetsByIndex[index];
}

/**
 * @param {string} name
 */
async function getSheetByName(name) {
  const d = await initDoc();
  await d.loadInfo();
  return d.sheetsByTitle[name];
}

/**
 * @param {*} id
 * @param {*} username
 * @param {*} lastConnect
 */
async function updateRow(id, username, lastConnect) {
  // get first sheet in xls
  const sheet = await getSheet(0);

  await sheet.addRows([
    {
      id: id,
      username: username,
      lastConnect: lastConnect,
    },
  ]);

  console.log('updated row');
}

/**
 * @param {*} id
 * @param {*} username
 * @param {*} online
 * @param {*} action
 */
async function createLoggingInfo(id, username, online, action) {
  // get first sheet in xls
  const sheet = await getSheet(1);

  await sheet.addRows([
    {
      id: id,
      username: username,
      online: online,
      action: action,
    },
  ]);
}

/**
 * Get configuration from 'Config' sheet
 * Assumes Sheet structure: Key | Value
 */
async function getConfig() {
  console.log('[GoogleSheets] Loading config from "Config" sheet...');
  const sheet = await getSheetByName('Config');
  if (!sheet) {
    const d = await initDoc();
    const sheetTitles = d.sheetsByIndex.map(s => s.title).join(', ');
    console.error(`[GoogleSheets] Error: "Config" sheet not found! Available sheets: [${sheetTitles}]`);
    return {};
  }

  const rows = await sheet.getRows();
  const config = {};
  rows.forEach((row) => {
    // Case-insensitive key/value access
    const key = row.get('Key') || row.get('key');
    const value = row.get('Value') || row.get('value');
    if (key) config[key] = value;
  });
  return config;
}

/**
 * Update configuration in 'Config' sheet
 * @param {string} key
 * @param {string} value
 */
async function updateConfig(key, value) {
  console.log(`[GoogleSheets] Updating config: ${key} = ${value}`);
  const sheet = await getSheetByName('Config');
  if (!sheet) {
    const d = await initDoc();
    const sheetTitles = d.sheetsByIndex.map(s => s.title).join(', ');
    throw new Error(`Worksheet "Config" not found. Available sheets: [${sheetTitles}]`);
  }

  const rows = await sheet.getRows();
  const row = rows.find((r) => (r.get('Key') || r.get('key')) === key);

  if (row) {
    row.set('Value', value);
    await row.save();
    console.log(`[GoogleSheets] Successfully updated ${key} to ${value}`);
  } else {
    console.log(`[GoogleSheets] Key ${key} not found, adding new row...`);
    await sheet.addRow({ Key: key, Value: value });
  }
}

module.exports = {
  initDoc,
  updateRow,
  createLoggingInfo,
  getConfig,
  updateConfig,
};
