const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// @route   GET /api/users
// @desc    Get all users (admin only)
router.get('/', authMiddleware, checkRole(['admin']), getAllUsers);

// @route   GET /api/users/:id
// @desc    Get single user by ID (admin only)
router.get('/:id', authMiddleware, checkRole(['admin']), getUserById);

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
router.put('/:id', authMiddleware, checkRole(['admin']), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteUser);

// Public artisan profile and their products
router.get('/artisan/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    const Product = require('../models/Product');
    const artisan = await User.findById(req.params.id).select('name email artisanStatus');
    if (!artisan || artisan.artisanStatus !== 'approved') return res.status(404).json({ error: 'Artisan not found' });
    const products = await Product.find({ artisan: artisan._id });
    res.json({ artisan, products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch artisan', details: err.message });
  }
});

module.exports = router;