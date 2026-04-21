const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "" },
  photo: { type: String, default: "" },
  provider: { type: String, default: "firebase" },
  status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);