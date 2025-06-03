const Product = require('../models/Product');

// Create a new product (artisan or admin)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({ 
      ...req.body, 
      artisan: req.user.role === 'artisan' ? req.user.id : req.body.artisan
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ 
      error: 'Product creation failed',
      details: error.message 
    });
  }
};

// Get all products (public)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('artisan', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error.message 
    });
  }
};

// Get single product by ID (public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artisan', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch product',
      details: error.message 
    });
  }
};

// Update a product (artisan for own products, admin for any)
exports.updateProduct = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'artisan') {
      query = { _id: req.params.id, artisan: req.user.id };
    } else if (req.user.role === 'admin') {
      query = { _id: req.params.id };
    }
    const product = await Product.findOneAndUpdate(
      query,
      req.body,
      { new: true }
    ).populate('artisan', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ 
      error: 'Update failed',
      details: error.message 
    });
  }
};

// Delete a product (artisan for own products, admin for any)
exports.deleteProduct = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'artisan') {
      query = { _id: req.params.id, artisan: req.user.id };
    } else if (req.user.role === 'admin') {
      query = { _id: req.params.id };
    }
    const product = await Product.findOneAndDelete(query);
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Delete failed',
      details: error.message 
    });
  }
};

// Product analytics (views, sales count)
exports.getProductAnalytics = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const productId = req.params.id;
    // Count how many times this product was ordered
    const salesCount = await Order.countDocuments({ 'items.product': productId });
    // You can add more analytics here (e.g., views if you track them)
    res.json({ salesCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics', details: err.message });
  }
};