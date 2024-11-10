const {Parcel} = require('../models/parcel');
const {DeliveryPartner} = require('../models/deliveryPartner');

module.exports = {
  createParcel: async (req, res) => {
    console.log("he")
    try {
      const parcel = new Parcel({
        ...req.body,
        userId: req.user.id,
        trackingNumber: `PKG${Date.now()}${Math.floor(Math.random() * 1000)}`
      });
      await parcel.save();
      res.status(201).json(parcel);
      console.log("h")
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getParcelHistory: async (req, res) => {
    try {
      const parcels = await Parcel.find({ userId: req.user.id })
        .populate('assignedTo', 'vehicleInfo.vehicleType')
        .sort({ createdAt: -1 });
      res.json(parcels);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  trackParcel: async (req, res) => {
    try {
      const parcel = await Parcel.findOne({ trackingNumber: req.params.trackingNumber })
        .populate('assignedTo', 'vehicleInfo.vehicleType');
      
      if (!parcel) {
        return res.status(404).json({ message: 'Parcel not found' });
      }
      
      res.json(parcel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getParcelOffers: async (req, res) => {
    try {
      const parcel = await Parcel.findById(req.params.parcelId)
        .populate('deliveryBids.partnerId', 'vehicleInfo');
      
      if (!parcel) {
        return res.status(404).json({ message: 'Parcel not found' });
      }
      
      res.json(parcel.deliveryBids);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};