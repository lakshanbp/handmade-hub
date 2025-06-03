const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderAnalytics
} = require('../controllers/orderController');

// Create a new order (customer only)
router.post('/', authMiddleware, checkRole(['customer']), createOrder);

// Get orders for the currently logged-in user (customer only)
router.get('/my', authMiddleware, checkRole(['customer']), getMyOrders);

// Get all orders (admin only)
router.get('/', authMiddleware, checkRole(['admin']), getAllOrders);

// Get orders by a specific user ID (admin only)
router.get('/user/:userId', authMiddleware, checkRole(['admin']), getOrdersByUser);

// Get a single order by ID (admin or customer)
router.get('/:id', authMiddleware, checkRole(['admin', 'customer']), getOrderById);

// Update the status of an order (admin only)
router.put('/:id/status', authMiddleware, checkRole(['admin']), updateOrderStatus);

// Delete an order by ID (admin only)
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteOrder);

// Order analytics endpoint (admin only)
router.get('/analytics', authMiddleware, checkRole(['admin']), getOrderAnalytics);

module.exports = router;