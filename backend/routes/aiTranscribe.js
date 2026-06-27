const express = require("express");
const router = express.Router();

router.post("/transcribe", (req, res) => {
  const { audioText } = req.body;

  if (!audioText) {
    return res.status(400).json({ error: "No audio text provided" });
  }

  res.json({
    success: true,
    transcript: `Transcribed: ${audioText}`,
  });
});

module.exports = router;