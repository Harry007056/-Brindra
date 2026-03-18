const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: String,
    required: true
  },
  period: {
    type: String,
    default: 'per user / month'
  },
  desc: {
    type: String,
    required: true
  },
  detail: String,
  cta: String,
  bestFor: String,
  pricePerMember: {
    type: Number,
    default: 0
  },
  memberRule: String,
  features: [String],
  limitations: [String],
  popular: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);

