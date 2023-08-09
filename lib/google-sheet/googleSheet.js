/* eslint-disable linebreak-style */
require('dotenv').config();
const {GoogleSpreadsheet} = require('google-spreadsheet');

// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

/**
 * @param {*} index
 */
async function getSheet(index) {
  // login
  await doc.useServiceAccountAuth({
    /**
     * env var values are copied from service account
     * credentials generated by google
     * see "Authentication" section in docs for more info
     */
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env
        .GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  });

  await doc.loadInfo();

  return doc.sheetsByIndex[index];
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
 * @param {*} platform
 */
async function createLoggingInfo(id, username, online, platform) {
  // get first sheet in xls
  const sheet = await getSheet(1);

  await sheet.addRows([
    {
      id: id,
      username: username,
      online: online,
      platform: platform,
    },
  ]);
}

module.exports = {
  updateRow,
  createLoggingInfo,
};