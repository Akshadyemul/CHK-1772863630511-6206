const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    // Required fields requested
    medicineName: { type: String, required: true, trim: true },
    searchType: { type: String, required: true, enum: ["search"], default: "search" },
    date: { type: Date, required: true, default: Date.now },

    // Extra fields kept for backward compatibility with the mobile app
    medicineData: { type: mongoose.Schema.Types.Mixed },
    source: { type: String, enum: ["search", "scan"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", HistorySchema);

