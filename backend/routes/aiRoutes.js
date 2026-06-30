const express = require("express");

const router = express.Router();

/* =====================================================
   AI WHISPER TRANSCRIPTION (SIMULATED)
===================================================== */

router.post("/transcribe", async (req, res) => {
  try {
    const { audioText, text } = req.body;

    const meetingText = audioText || text;

    if (!meetingText || meetingText.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "No meeting content provided.",
      });
    }

    // simulate AI processing
    await new Promise((r) => setTimeout(r, 1000));

    const cleaned = meetingText
      .replace(/\s+/g, " ")
      .replace(/uh/gi, "")
      .replace(/umm/gi, "")
      .trim();

    const transcript = cleaned;

    res.json({
      success: true,
      transcript,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Transcription failed.",
    });
  }
});

/* =====================================================
   AI SUMMARY
===================================================== */

router.post("/summary", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || transcript.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Transcript required.",
      });
    }

    await new Promise((r) => setTimeout(r, 1200));

    const words = transcript.split(" ");

    const summary =
      words.length > 40
        ? words.slice(0, 40).join(" ") + "..."
        : transcript;

    const actionItems = [];

    const lower = transcript.toLowerCase();

    if (lower.includes("task"))
      actionItems.push("Create discussed tasks");

    if (lower.includes("deadline"))
      actionItems.push("Review upcoming deadlines");

    if (lower.includes("meeting"))
      actionItems.push("Schedule next meeting");

    if (lower.includes("project"))
      actionItems.push("Continue project development");

    if (actionItems.length === 0) {
      actionItems.push("Review meeting discussion");
      actionItems.push("Assign responsibilities");
      actionItems.push("Prepare for next meeting");
    }

    res.json({
      success: true,
      summary,
      actionItems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Summary generation failed.",
    });
  }
});

module.exports = router;