const DeliveryPartner = require("../models/deliveryPartner");
const Parcel = require("../models/parcel");

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const partner = await DeliveryPartner.findOne({ userId: req.user.id });
      const upcomingDeliveries = await Parcel.find({
        assignedTo: partner._id,
        status: { $in: ["assigned", "in_transit"] },
      });

      res.json({
        ...partner.stats,
        upcomingDeliveries,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const partner = await DeliveryPartner.findOne({
        userId: req.user.id,
      }).populate("userId", "firstName lastName email phoneNumber");
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const partner = await DeliveryPartner.findOneAndUpdate(
        { userId: req.user.id },
        { $set: req.body },
        { new: true }
      );
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  submitBid: async (req, res) => {
    try {
      const { parcelId, price } = req.body;
      const partner = await DeliveryPartner.findOne({ userId: req.user.id });

      const parcel = await Parcel.findByIdAndUpdate(
        parcelId,
        {
          $push: {
            deliveryBids: {
              partnerId: partner._id,
              price,
              status: "pending",
            },
          },
        },
        { new: true }
      );

      res.json(parcel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
