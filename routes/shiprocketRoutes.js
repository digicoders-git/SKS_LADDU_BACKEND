// routes/shiprocketRoutes.js
const express = require('express');
const router = express.Router();
const { createOrderForExisting, getTrackingInfo, cancelOrder } = require('../controllers/shiprocketOrder.controller');
const { authenticateAdmin } = require('../middleware/adminAuth');

// Admin routes for Shiprocket
router.post('/create-order/:orderId', authenticateAdmin, createOrderForExisting);
router.get('/track/:awbCode', authenticateAdmin, getTrackingInfo);
router.post('/cancel-order/:orderId', authenticateAdmin, cancelOrder);

module.exports = router;