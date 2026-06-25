const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");
const auth = require("../middleware/authMiddleware");

// create meeting
router.post("/create", auth, meetingController.createMeeting);

// get meetings
router.get("/", auth, meetingController.getMeetings);

module.exports = router;