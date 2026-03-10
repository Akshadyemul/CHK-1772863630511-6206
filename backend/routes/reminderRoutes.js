const express = require("express");
const Reminder = require("../models/Reminder");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 }).lean();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
});

router.post("/", async (req, res) => {
  const { medicineName, time, date, reminderTime } = req.body || {};

  if (!medicineName || typeof medicineName !== "string" || !medicineName.trim()) {
    return res.status(400).json({ message: "medicineName is required" });
  }

  try {
    let finalTime = typeof time === "string" && time.trim() ? time.trim() : null;
    let finalDate = typeof date === "string" && date.trim() ? date.trim() : null;
    let createdAt = new Date();
    let reminderTimeDate = undefined;

    if (reminderTime) {
      const d = new Date(reminderTime);
      if (!Number.isNaN(d.getTime())) {
        createdAt = d;
        reminderTimeDate = d;
        // Derive human-readable date/time strings if not provided
        finalTime = finalTime || d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        finalDate =
          finalDate || d.toISOString().slice(0, 10); // YYYY-MM-DD
      }
    }

    if (!finalTime || !finalDate) {
      return res
        .status(400)
        .json({ message: "Either valid reminderTime or both time and date strings are required" });
    }

    const created = await Reminder.create({
      medicineName: medicineName.trim(),
      time: finalTime,
      date: finalDate,
      createdAt,
      reminderTime: reminderTimeDate,
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Failed to save reminder" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Reminder.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reminder" });
  }
});

module.exports = router;

