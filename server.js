/**
 * This is the main class, contain all route of the application
 * Author: Vincent Tran
 */
const express = require("express");
const path = require("path");
const app = express();
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
    updateRow[0].status = updateRow[0].status === "New" ? "Done" : "New";
    await updateRow[0].save();
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
