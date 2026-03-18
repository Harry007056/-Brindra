const Plan = require('../models/Plans');

exports.listPlans = async (req, res) => {
  try {
    const plans = await Plan.find({}).sort({ popular: -1, createdAt: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findOne({ id: req.params.id });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plan' });
  }
};

