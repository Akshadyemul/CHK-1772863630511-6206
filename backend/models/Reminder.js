const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    // Requested fields
    medicineName: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    createdAt: { type: Date, required: true, default: Date.now },

    // Backwards-compatible field for older clients (can be removed later)
    reminderTime: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", ReminderSchema);

