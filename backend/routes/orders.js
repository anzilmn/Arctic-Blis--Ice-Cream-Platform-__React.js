const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// @POST /api/orders - Place a new order
router.post('/', optionalAuth, [
  body('customerName').trim().notEmpty().withMessage('Name is required'),
  body('customerEmail').isEmail().withMessage('Valid email required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.pincode').notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').isIn(['card', 'upi', 'cod']).withMessage('Invalid payment method'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { customerName, customerEmail, customerPhone, items, shippingAddress, paymentMethod, notes } = req.body;

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 20 ? 0 : 2.99;
    const total = subtotal + deliveryFee;

    const orderData = {
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      total: Math.round(total * 100) / 100,
      notes,
      statusHistory: [{ status: 'Placed', updatedAt: new Date() }],
    };

    if (req.user) {
      orderData.user = req.user._id;
      // Award loyalty points (1 point per $1 spent)
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, { 
        $inc: { loyaltyPoints: Math.floor(total) } 
      });
    }

    const order = await Order.create(orderData);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/orders/my - Get logged-in user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/orders/track/:orderId - Track by order ID string (public)
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/orders - Admin: get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/orders/:id/status - Admin: update order status
router.put('/:id/status', protect, adminOnly, [
  body('status').isIn(['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']),
], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = req.body.status;
    if (req.body.status === 'Delivered') {
      order.paymentStatus = 'paid';
    }
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/orders/:id - Admin: cancel order
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: 'Cancelled' }, 
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
