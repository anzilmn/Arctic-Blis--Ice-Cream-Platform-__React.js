const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Flavor = require('../models/Flavor');
const Review = require('../models/Review');
const Complaint = require('../models/Complaint');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/admin/stats - Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalFlavors,
      totalOrders,
      totalRevenue,
      pendingComplaints,
      unreadMessages,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Flavor.countDocuments({ isAvailable: true }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Complaint.countDocuments({ status: 'open' }),
      Contact.countDocuments({ isRead: false }),
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFlavors,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingComplaints,
        unreadMessages,
      },
      recentOrders,
      ordersByStatus,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/admin/users - All users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).sort('-createdAt');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/admin/users/:id/toggle - Toggle user active state
router.put('/users/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
