const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#cccccc",
  },
  isIncome: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);