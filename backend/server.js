require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const flavorRoutes = require('./routes/flavors');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const complaintRoutes = require('./routes/complaints');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

const app = express();

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/flavors', flavorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '🍦 Arctic Bliss API is running!' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error' 
  });
});

// --- DB + Server Start ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/arctic-bliss';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
