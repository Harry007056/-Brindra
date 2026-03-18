const express = require('express');
const plansController = require('../controllers/PlansController');

const router = express.Router();

router.get('/', plansController.listPlans);
router.get('/:id', plansController.getPlanById);

module.exports = router;

