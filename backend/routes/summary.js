const express = require("express");
const router = express.Router();

// 🔥 AI SUMMARY + ACTION ITEM EXTRACTION (SIMULATED GPT)
router.post("/summary", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        error: "No transcript provided",
      });
    }

    await new Promise((r) => setTimeout(r, 800));

    const summary = `
📌 Meeting Summary:
- Discussed IntellMeet project architecture
- Reviewed Week 3 AI features
- Assigned collaboration tasks
- Planned Kanban and notification system integration
`;

    const actionItems = [
      "Implement Kanban board UI",
      "Add task assignment system",
      "Build notification system",
      "Finalize AI integration flow",
    ];

    res.json({
      success: true,
      summary,
      actionItems,
    });
  } catch (err) {
    res.status(500).json({
      error: "Summary generation failed",
    });
  }
});

module.exports = router;