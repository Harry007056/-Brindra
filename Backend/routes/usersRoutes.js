const express = require("express");
const usersController = require("../controllers/UsersController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", usersController.list);
router.post("/:id/assign-plan", authMiddleware(["team_leader", "manager"]), usersController.assignPlan);

module.exports = router;
