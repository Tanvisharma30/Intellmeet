const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");

// create meeting
router.post("/create", meetingController.createMeeting);

// get meetings
router.get("/", meetingController.getMeetings);

module.exports = router;