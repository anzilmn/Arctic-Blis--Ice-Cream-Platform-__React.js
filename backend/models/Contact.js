const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  message: {
    type: String,
    required: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  isRead: { type: Boolean, default: false },
  adminReply: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
