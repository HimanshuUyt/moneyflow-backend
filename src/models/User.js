const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  email: String,
  name: String,
  photo: String,
  provider: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);