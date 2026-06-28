const express = require("express");
const router = express.Router();

// SIMPLE NLP-STYLE ACTION ITEM EXTRACTOR
function extractActions(text) {
  const sentences = text.split(/[.?!]/).map(s => s.trim());

  const keywords = [
    "need to",
    "must",
    "should",
    "assign",
    "todo",
    "follow up",
    "complete",
    "finish",
    "create",
    "update",
    "fix",
  ];

  const actions = sentences.filter((sentence) =>
    keywords.some((kw) => sentence.toLowerCase().includes(kw))
  );

  return actions.map((a) => ({
    title: a,
    status: "Todo",
  }));
}

// ---------------- EXTRACT ACTION ITEMS ----------------
router.post("/extract", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.json({ tasks: [] });
    }

    const tasks = extractActions(text);

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;