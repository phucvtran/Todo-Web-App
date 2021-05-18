/**
 * Google speard sheet class.
 * The google spread sheet will be loaded in this class and export for SpreadsheetService.js class
 *
 */
const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

/**
 * Get the existed sheet from google.
 * @param {*} sheetId
 * @returns the sheet document.
 */
async function loadNewSheet() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY,
  });
  await doc.loadInfo();
  // await initSheet(doc);
  return doc;
}

/**
 * for testing purpose only. This function initialize test data on Google sheet.
 * @param {} doc is the google spreadsheet document
 */
async function initSheet(doc) {
  const sheet = await doc.sheetsByIndex[0];
  //   sheet.setHeaderRow([
  //     "task",
  //     "status",
  //     "user",
  //     "date",
  //   ]);

  for (let index = 0; index < 11; index++) {
    const row = await sheet.addRow({
      task: "task" + index,
      status: "New",
      user: "user" + index,
      date: new Date().toDateString().replace(" ", " - "),
    });
    row.save();
  }
}

module.exports = loadNewSheet();
