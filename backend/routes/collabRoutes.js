const express = require("express");

const usersController = require("../controllers/UsersController");
const projectsController = require("../controllers/ProjectsController");
const tasksController = require("../controllers/TasksController");
const messagesController = require("../controllers/MessagesController");
const filesController = require("../controllers/FilesController");

const router = express.Router();

router.post("/users", usersController.create);
router.get("/users", usersController.list);

router.post("/projects", projectsController.create);
router.get("/projects", projectsController.list);

router.post("/tasks", tasksController.create);
router.get("/tasks", tasksController.list);

router.post("/messages", messagesController.create);
router.get("/messages", messagesController.list);

router.post("/files", filesController.create);
router.get("/files", filesController.list);

module.exports = router;
