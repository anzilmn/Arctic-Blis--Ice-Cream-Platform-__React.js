const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  flavor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flavor',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Guest reviews allowed
  guestName: { type: String },
  
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Minimum rating is 1'],
    max: [5, 'Maximum rating is 5'],
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [5, 'Comment must be at least 5 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  isApproved: {
    type: Boolean,
    default: true, // auto-approve; admin can toggle
  },
  helpfulVotes: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// One review per user per flavor
reviewSchema.index({ flavor: 1, user: 1 }, { unique: true, sparse: true });

// After save, update flavor's averageRating
reviewSchema.post('save', async function () {
  const Flavor = mongoose.model('Flavor');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { flavor: this.flavor, isApproved: true } },
    { $group: { _id: '$flavor', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Flavor.findByIdAndUpdate(this.flavor, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
