const express = require('express');
const router = express.Router();
const deliveryPartnerController = require('../controller/deliveryPartnerController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, deliveryPartnerController.getDashboard);
router.post('/update-details', auth, deliveryPartnerController.updatedeliveryDetails);
router.get('/profile', auth, deliveryPartnerController.getProfile);
router.put('/profile', auth, deliveryPartnerController.updateProfile);
router.post('/bid', auth, deliveryPartnerController.submitBid);
router.post('/accept-parcel/:id', auth, deliveryPartnerController.acceptParcel);

module.exports = router;