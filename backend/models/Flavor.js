const mongoose = require('mongoose');

const flavorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Flavor name is required'],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['Chocolate', 'Fruit', 'Special'],
    required: [true, 'Category is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  ingredients: [{ type: String }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 100,
    min: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

// Auto-generate slug from name
flavorSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Flavor', flavorSchema);
