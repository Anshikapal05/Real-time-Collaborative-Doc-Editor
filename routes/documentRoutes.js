const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

// Save or update document
router.post("/save", async (req, res) => {
  const { username, documentId, content } = req.body;

  try {
    let doc = await Document.findOne({ documentId });

    if (doc) {
      doc.content = content;
      doc.lastUpdated = new Date();
      await doc.save();
      return res.json({ message: "Document updated" });
    }

    const newDoc = new Document({ username, documentId, content });
    await newDoc.save();
    res.json({ message: "Document saved" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving document");
  }
});

// Get document by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findOne({ documentId: req.params.id });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
