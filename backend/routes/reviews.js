const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Flavor = require('../models/Flavor');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// @GET /api/reviews/:flavorId - Get reviews for a flavor
router.get('/:flavorId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      flavor: req.params.flavorId, 
      isApproved: true 
    })
      .populate('user', 'name')
      .sort('-createdAt');
    
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/reviews/:flavorId - Submit a review
router.post('/:flavorId', optionalAuth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').trim().isLength({ min: 5, max: 500 }).withMessage('Comment must be 5-500 characters'),
  body('guestName').optional().trim().isLength({ min: 2 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const flavor = await Flavor.findById(req.params.flavorId);
    if (!flavor) return res.status(404).json({ success: false, message: 'Flavor not found' });

    // Check duplicate review by logged in user
    if (req.user) {
      const existing = await Review.findOne({ flavor: req.params.flavorId, user: req.user._id });
      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this flavor' });
      }
    }

    const reviewData = {
      flavor: req.params.flavorId,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    if (req.user) {
      reviewData.user = req.user._id;
    } else {
      reviewData.guestName = req.body.guestName || 'Guest';
    }

    const review = await Review.create(reviewData);
    await review.populate('user', 'name');

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/reviews - Admin: all reviews
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('flavor', 'name')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/reviews/:id/approve - Admin toggle approval
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isApproved = !review.isApproved;
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/reviews/:id - Admin delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
