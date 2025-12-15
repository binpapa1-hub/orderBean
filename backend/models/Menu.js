const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['coffee', 'tea', 'beverage', 'dessert', 'food'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  options: {
    sizes: [{
      name: String,
      price: Number
    }],
    shots: [{
      name: String,
      price: Number
    }],
    syrups: [{
      name: String,
      price: Number
    }],
    milk: [{
      name: String,
      price: Number
    }],
    ice: [{
      name: String,
      price: Number
    }]
  },
  cafeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Menu', menuItemSchema);

