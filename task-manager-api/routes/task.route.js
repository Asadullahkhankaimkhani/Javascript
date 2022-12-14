const express = require("express");
const routes = express.Router();

// Controllers
const {
  createTask,
  deleteTask,
  getAllTask,
  getOneTask,
  updateTask,
} = require("../controller/task.controller");

routes.route("/task").post(createTask).get(getAllTask);
routes.route("/task/:id").get(getOneTask).patch(updateTask).delete(deleteTask);

module.exports = routes;
