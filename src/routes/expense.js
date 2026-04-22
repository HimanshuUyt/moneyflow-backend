const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ================= ADD EXPENSE =================
router.post("/", async (req, res) => {
  try {
    const { title, amount, userId } = req.body;

    if (!title || !amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const expense = new Expense({
      title,
      amount,
      userId,
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense added",
      data: expense,
    });

  } catch (err) {
    console.error("❌ ADD EXPENSE:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ================= GET USER EXPENSES =================
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const expenses = await Expense.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: expenses,
    });

  } catch (err) {
    console.error("❌ GET EXPENSE:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ================= DELETE EXPENSE =================
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Expense deleted",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;