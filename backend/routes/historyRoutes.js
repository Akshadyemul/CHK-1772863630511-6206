const express = require("express");
const History = require("../models/History");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await History.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

router.post("/", async (req, res) => {
  const { medicineName, medicineData, searchType, date, source } = req.body || {};

  if (!medicineName || typeof medicineName !== "string" || !medicineName.trim()) {
    return res.status(400).json({ message: "medicineName is required" });
  }

  try {
    const created = await History.create({
      medicineName: medicineName.trim(),
      medicineData: medicineData ?? null,
      searchType: searchType || "search",
      date: date ? new Date(date) : new Date(),
      source,
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to save history item" });
  }
});

module.exports = router;

