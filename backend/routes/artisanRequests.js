const express = require('express');
const router = express.Router();
const { getAllArtisanRequests, handleArtisanRequest, deleteArtisanRequest } = require('../controllers/artisanRequestController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

// Get all artisan requests (admin only)
router.get('/', authMiddleware, checkRole(['admin']), getAllArtisanRequests);

// Approve or reject artisan request (admin only)
router.put('/:requestId', authMiddleware, checkRole(['admin']), handleArtisanRequest);

// Delete artisan request (admin only)
router.delete('/:requestId', authMiddleware, checkRole(['admin']), deleteArtisanRequest);

module.exports = router;