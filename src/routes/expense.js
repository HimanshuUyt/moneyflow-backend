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

    const expense = await Expense.create({
      title,
      amount,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Expense added",
      data: expense,
    });

  } catch (err) {
    console.error("ADD EXPENSE:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ================= GET ALL EXPENSES (ADMIN) =================
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: expenses,
    });

  } catch (err) {
    console.error("GET ALL EXPENSES:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ================= GET USER EXPENSES =================
router.get("/user/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: expenses,
    });

  } catch (err) {
    console.error("GET USER EXPENSES:", err.message);

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

    res.status(200).json({
      success: true,
      message: "Expense deleted",
    });

  } catch (err) {
    console.error("DELETE EXPENSE:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;