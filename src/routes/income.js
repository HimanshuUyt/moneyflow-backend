const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// ================= ADD INCOME =================
router.post("/", async (req, res) => {
  try {
    const { title, amount, userId } = req.body;

    if (!title || !amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const income = new Income({
      title,
      amount,
      userId,
    });

    await income.save();

    res.status(201).json({
      success: true,
      message: "Income added",
      data: income,
    });

  } catch (err) {
    console.error("❌ ADD INCOME:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ================= GET USER INCOME =================
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const incomes = await Income.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: incomes,
    });

  } catch (err) {
    console.error("❌ GET INCOME:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ================= DELETE INCOME =================
router.delete("/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Income deleted",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;