/**
 * This is the main class, contain all route of the application
 * Author: Vincent Tran
 */
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
const SpreadsheetService = require("./services/SpreadsheetService");

/**
 * LOAD STATIC FILE
 * set template engine, I use EJS template engine for this project.
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set("view engine", "ejs");

/**
 * It's a support function
 * Get user list, every item in the list is UNIQUE
 * @param {*} list is a list of user (duplicate allows)
 * @returns a list of unique user (no duplicate)
 */
function getUserList(list) {
  const users = [];
  list.forEach((user) => {
    if (!users.includes(user.user)) {
      users.push(user.user);
    }
  });
  return users.reverse();
}
/**
 * Get all item from google sheet
 *
 * Method: GET
 * URL: /api/all
 *
 * success code: 200
 * failure code: 500
 */
app.get("/api/all", async (req, res) => {
  try {
    const data = [];
    const allRows = await SpreadsheetService.getAllRows();
    allRows.forEach((task) => {
      data.push({
        task: task.task,
        status: task.status,
        user: task.user,
        date: task.date,
      });
    });

    // pass in data as json
    return res.send({ result: 200, data: data });
  } catch (error) {
    console.log(error);
    return res.send({ result: 500, description: "something went wrong" });
  }
});

/**
 * Add new task or update status of the task
 *
 * Method: POST
 * URL: /api/data
 *
 * success code: 200
 * failure code: 500
 */
app.post("/api/data", async (req, res) => {
  try {
    const allRows = await SpreadsheetService.getAllRows();
    const row = allRows.filter(
      (param) =>
        param.task === req.body.task.trim() &&
        param.user === req.body.user.trim()
    );
    // if there is a matched task
    if (row.length > 0) {
      await SpreadsheetService.updateRow(row[0], req.body.status);
      return res.send({
        result: 200,
        description: "Key already exists, Update Task Status",
      });
    } else {
      await SpreadsheetService.addRow(req.body);
      return res.send({ result: 200, description: "New task Add" });
    }
  } catch (error) {
    return res.send({ result: 500, description: "something went wrong" });
  }
});

/**
 * Delete a task using task name
 *
 * Method: DELETE
 * URL: /api/data/:task
 *
 * success code: 200
 * failure code: 500
 */
app.delete("/api/data/:task", async (req, res) => {
  try {
    const allRows = await SpreadsheetService.getAllRows();
    const row = allRows.filter(
      (param) => param.task === req.params.task.trim()
    );
    // delete if condition is met
    await row[0].delete();
    return res.send({
      status: 200,
      description: "task: " + req.params.task + " is deleted",
    });
  } catch (error) {
    return res.send({
      result: 404,
      description: "key not found",
    });
  }
});

/**
 * Load data from google sheet to home page.
 */
app.get("/", async (req, res, next) => {
  try {
    const allRows = await SpreadsheetService.getAllRows();
    return res.render("index", {
      data: allRows,
      pageTitle: "Todo List",
      allUser: getUserList(allRows),
      selectedUser: "",
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Load data from google sheet for selected user
 */
app.get("/:user", async (req, res, next) => {
  try {
    const allRows = await SpreadsheetService.getAllRows();
    return res.render("index", {
      data: allRows.filter((row) => row.user === req.params.user), // get task list for selected user.
      pageTitle: "Todo List",
      allUser: getUserList(allRows),
      selectedUser: req.params.user,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * Remove Button event listener
 * When user click on Remove button run the query to remove the task from Google Sheet
 */
app.post("/removetask", async (req, res, next) => {
  try {
    const allRows = await SpreadsheetService.getAllRows();
    // get row to delete
    // req.body.removebtn hold the name of task.
    const deleteRow = allRows.filter(
      (task) => task.task === req.body.removebtn
    );

    // execute deletion.
    await deleteRow[0].delete();

    //redirect to the same page.
    return res.redirect("back");
  } catch (error) {
    next(error);
  }
});

/**
 * update task status when status button is clicked.
 */
app.post("/updatetask", async (req, res, next) => {
  try {
    const allRows = await SpreadsheetService.getAllRows();
    // get task to update.
    // req.body.updatebtn hold task name property.
    const updateRow = allRows.filter(
      (task) => task.task === req.body.updatebtn
    );

    // Update status based on current status.
    await SpreadsheetService.updateRow(
      updateRow[0],
      updateRow[0].status === "New" ? "Done" : "New"
    );

    return res.redirect("back");
  } catch (error) {
    return next(error);
  }
});

/**
 * add new task in Home screen if the task doesn't exist on google sheet.
 */
app.post("/", async (req, res, next) => {
  //capture user input for task and user
  const task = req.body.newTask.trim();
  const user = req.body.userInput.trim();
  try {
    const allRows = await SpreadsheetService.getAllRows();
    // check if there is any input for task or user
    if (task && user) {
      //if the task's existed for selected user, task will not be added. Redirect to the home page.
      if (SpreadsheetService.checkDuplicate(allRows, task, user)) {
        console.error("ERROR: The task existed for this user: " + user);
        return res.redirect("/");
      }

      // add user if conditions are met.
      await SpreadsheetService.addRow({
        task: req.body.newTask,
        user: req.body.userInput,
        status: "New",
        date: new Date().toDateString().replace(" ", " - "),
      });
      return res.redirect("/");
    }
    console.error("ERROR: There is no input for Task or User");
    return res.redirect("/");
  } catch (error) {
    // Error handling
    return next(error);
  }
});

/**
 * Add new task for selected user. this is the form on User page.
 */
app.post("/:user", async (req, res, next) => {
  //capture user input for task and user
  const task = req.body.newTask.trim();
  const user = req.params.user.trim();
  try {
    const allRows = await SpreadsheetService.getAllRows();
    if (task && user) {
      //if the task's existed for selected user, task will not be added. Redirect to the user page.
      if (SpreadsheetService.checkDuplicate(allRows, task, user)) {
        console.error("ERROR: The task existed for this user: " + user);
        return res.redirect("/" + req.params.user);
      }

      await SpreadsheetService.addRow({
        task: task,
        user: user,
        status: "New",
        date: new Date().toDateString().replace(" ", " - "),
      });
      return res.redirect("/" + req.params.user);
    }
    return res.redirect("/" + req.params.user);
  } catch (error) {
    return next(error);
  }
});

// server port connection
app.listen(process.env.PORT, () =>
  console.log(`app is running on port ${process.env.PORT}`)
);
