const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  maxBranches: {
    type: Number,
    required: true,
    default: 0 // 0 means unlimited
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isDemo: {
    type: Boolean,
    default: false
  },
  durationDays: {
    type: Number,
    default: 30 // null or -1 for demo
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
