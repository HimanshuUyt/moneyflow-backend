const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/CategoryController');

// ================= ROUTES =================
router.post('/category', createCategory);
router.get('/category', getCategories);
router.delete('/category/:id', deleteCategory);

module.exports = router;