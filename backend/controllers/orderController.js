const Order = require('../models/Order');

// Create a new order (customer only)
exports.createOrder = async (req, res) => {
  try {
    const order = new Order({ 
      ...req.body, 
      customer: req.user.id,
      status: 'pending' // Ensure default status
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Order creation failed', details: error.message });
  }
};

// Get orders for the logged-in user (customer only)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// Get orders by user ID (admin only)
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.userId })
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user orders', details: error.message });
  }
};

// Get single order by ID (admin or customer)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Ensure customer can only access their own order
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to order' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status', details: error.message });
  }
};

// Delete order by ID (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
};

// Order analytics endpoint (admin dashboard stats)
exports.getOrderAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order analytics', details: err.message });
  }
};