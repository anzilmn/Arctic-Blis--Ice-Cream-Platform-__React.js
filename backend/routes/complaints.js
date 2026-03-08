const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// @POST /api/complaints - Submit a complaint
router.post('/', optionalAuth, [
  body('customerName').trim().notEmpty().withMessage('Name is required'),
  body('customerEmail').isEmail().withMessage('Valid email required'),
  body('type').isIn(['wrong_order', 'quality_issue', 'delivery_problem', 'billing_issue', 'other']).withMessage('Invalid type'),
  body('subject').trim().isLength({ min: 3, max: 100 }).withMessage('Subject must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('orderId').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const data = {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      type: req.body.type,
      subject: req.body.subject,
      description: req.body.description,
      orderId: req.body.orderId,
    };

    if (req.user) data.user = req.user._id;

    const complaint = await Complaint.create(data);
    res.status(201).json({ success: true, complaint, message: 'Complaint submitted. We will get back to you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/complaints/my - User's own complaints
router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/complaints - Admin: all complaints
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/complaints/:id - Admin: update status + response
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminResponse, priority } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (adminResponse) updates.adminResponse = adminResponse;
    if (priority) updates.priority = priority;
    if (status === 'resolved') updates.resolvedAt = new Date();

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
