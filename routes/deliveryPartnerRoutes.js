const express = require('express');
const router = express.Router();
const deliveryPartnerController = require('../controller/deliveryPartnerController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, deliveryPartnerController.getDashboard);
router.get('/profile', auth, deliveryPartnerController.getProfile);
router.put('/profile', auth, deliveryPartnerController.updateProfile);
router.post('/bid', auth, deliveryPartnerController.submitBid);

module.exports = router;