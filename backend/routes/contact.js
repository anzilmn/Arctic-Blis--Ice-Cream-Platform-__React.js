const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// @POST /api/contact - Send a message
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, message: "Message received! We'll get back to you soon. 🍦", contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/contact - Admin: all messages
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/contact/:id/read - Admin: mark as read
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { isRead: true, adminReply: req.body.reply }, { new: true });
    res.json({ success: true, msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
