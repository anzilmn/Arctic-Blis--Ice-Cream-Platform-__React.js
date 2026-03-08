const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  flavor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flavor',
  },
  flavorName: { type: String, required: true },
  flavorImage: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Guest info (for non-logged-in users)
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  
  items: [orderItemSchema],

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String, required: true },
  },

  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },

  status: {
    type: String,
    enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },

  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },

  estimatedDelivery: { type: String, default: '30-40 Minutes' },
  notes: { type: String },

  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    note: String,
  }],
}, { timestamps: true });

// Auto-generate orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${String(count + 1001).padStart(4, '0')}`;
  }
  // Track status changes
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status, updatedAt: new Date() });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
