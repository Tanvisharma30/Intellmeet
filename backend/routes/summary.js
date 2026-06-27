const express = require("express");
const router = express.Router();

router.post("/summary", (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "No transcript provided" });
  }

  res.json({
    success: true,
    summary: `Meeting Summary: ${transcript.slice(0, 120)}...`,
    actionItems: [
      "Review meeting discussion",
      "Complete assigned tasks",
      "Follow up next meeting",
    ],
  });
});

module.exports = router;