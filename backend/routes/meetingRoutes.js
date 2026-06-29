const express = require("express");
const meetingController = require("../controllers/meetingController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", auth, meetingController.createMeeting);
router.get("/", auth, meetingController.getMeetings);

module.exports = router;