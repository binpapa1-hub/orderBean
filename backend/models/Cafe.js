const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  phone: {
    type: String,
    trim: true
  },
  operatingHours: {
    open: {
      type: String,
      default: '08:00'
    },
    close: {
      type: String,
      default: '22:00'
    },
    days: [{
      type: String,
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    }]
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  congestionLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cafe', cafeSchema);

