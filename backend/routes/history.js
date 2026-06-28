const router = require("express").Router();
const MeetingHistory = require("../models/MeetingHistory");

router.post("/save", async (req, res) => {
  const data = await MeetingHistory.create(req.body);
  res.json(data);
});

router.get("/all", async (req, res) => {
  const data = await MeetingHistory.find().sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;