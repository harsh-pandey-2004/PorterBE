const express = require('express');
const router = express.Router();
const parcelController = require('../controller/parcelController');
const auth = require('../middleware/auth');

router.post('/', auth, parcelController.createParcel);
router.get('/', auth, parcelController.getParcelHistory);
router.get('/:trackingNumber/track', parcelController.trackParcel);
router.get('/:parcelId/offers', auth, parcelController.getParcelOffers);

module.exports = router;