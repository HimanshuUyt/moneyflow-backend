const Category = require('../models/Category');

// ================= CREATE =================
exports.createCategory = async (req, res) => {
  try {
    const { name, color, isIncome, status } = req.body;

    const category = new Category({
      name,
      color,
      isIncome,
      status,
    });

    const saved = await category.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL =================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json(categories); // ✅ ARRAY RETURN
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};