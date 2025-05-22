const express = require("express");
const router = express.Router();
const teamController = require("../controllers/team.controller");
const { authenticateToken } = require("../middleware/jwt.middleware");

router.use(authenticateToken);
router.post("/", teamController.createTeam);
router.get("/", teamController.getUserTeams);

router.get("/members", teamController.getTeamMembers);

router.get("/:teamId", teamController.getTeamById);
router.put("/:teamId", teamController.updateTeam);
router.post("/:teamId/members", teamController.addTeamMember);
router.delete("/:teamId/members/:userId", teamController.removeTeamMember);
router.delete("/:teamId", teamController.deleteTeam);

module.exports = router;
