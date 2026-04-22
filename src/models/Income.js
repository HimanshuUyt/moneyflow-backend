const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: String, // Firebase UID
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    default: "income",
  },

}, { timestamps: true });

module.exports = mongoose.model("Income", incomeSchema);