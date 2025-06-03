const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductAnalytics
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const checkArtisanStatus = async (req, res, next) => {
  const user = await require('../models/User').findById(req.user.id);
  if (req.user.role === 'artisan' && user.artisanStatus !== 'approved') {
    return res.status(403).json({ error: 'Artisan status not approved' });
  }
  next();
};

// Create a product (artisan or admin)
router.post('/', authMiddleware, checkRole(['artisan', 'admin']), checkArtisanStatus, createProduct);

// Update a product (artisan for own products, admin for any)
router.put('/:id', authMiddleware, checkRole(['artisan', 'admin']), checkArtisanStatus, updateProduct);

// Delete a product (artisan for own products, admin for any)
router.delete('/:id', authMiddleware, checkRole(['artisan', 'admin']), checkArtisanStatus, deleteProduct);

// Get all products (public)
router.get('/', getAllProducts);

// Get a single product by ID (public, allow all users)
router.get('/:id', getProductById);

// Product search/filter endpoint
router.get('/search', async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (query) filter.name = { $regex: query, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    const products = await require('../models/Product').find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// Product analytics endpoint
router.get('/:id/analytics', getProductAnalytics);

module.exports = router;