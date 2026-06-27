const express = require("express");
const router = express.Router();

router.post("/summary", (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "No transcript provided" });
  }

  res.json({
    success: true,
    summary: "This is a generated AI summary (mock)",
    actionItems: ["Follow up discussion", "Assign tasks"],
  });
});

module.exports = router;