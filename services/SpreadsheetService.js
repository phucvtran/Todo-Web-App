/**
 * SpreadsheetService class.
 */
const sheet = require("./sheet");

class SpreadsheetService {
  /**
   * get all rows from google sheet
   * @returns array of rows Object
   */
  static async getAllRows() {
    return (await sheet).sheetsByIndex[0].getRows();
  }

  /**
   * Update status of task
   * @param {*} row row to update
   * @param {*} status new status
   * @returns updated row.
   */
  static async updateRow(row, status) {
    row.status = status;
    return await row.save();
  }

  /**
   * check if the task is existed in the Google sheet.
   * @param {*} rows list of task
   * @param {*} taskName name of new task
   * @param {*} user name of user
   * @returns true if there is duplicate task, otherwise return false
   */
  static checkDuplicate(rows, taskName, user) {
    for (let index = 0; index < rows.length; index++) {
      if (rows[index].task === taskName && rows[index].user === user) {
        return true;
      }
    }

    return false;
  }

  /**
   * Add new task to google sheet
   * @param {*} row task
   * @returns new task.
   */
  static async addRow(row) {
    return (await sheet).sheetsByIndex[0].addRow({
      task: row.task,
      status: row.status,
      user: row.user,
      date: row.date,
    });
  }
}

module.exports = SpreadsheetService;
