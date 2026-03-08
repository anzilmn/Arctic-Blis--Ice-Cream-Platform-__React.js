const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Guest complaints allowed
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  orderId: { type: String }, // for reference display

  type: {
    type: String,
    enum: ['wrong_order', 'quality_issue', 'delivery_problem', 'billing_issue', 'other'],
    required: [true, 'Complaint type is required'],
  },

  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: [100, 'Subject cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },

  status: {
    type: String,
    enum: ['open', 'in_review', 'resolved', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },

  adminResponse: { type: String },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
