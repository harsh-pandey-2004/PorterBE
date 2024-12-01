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

  acceptParcel: async (req, res) => {
    try {
      const { parcelId } = req.body;

      if (!parcelId) {
        return res.status(400).json({ message: "Parcel ID is required." });
      }

      // Check if the parcel has already been accepted
      const parcel = await Parcel.findById(parcelId);
      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found." });
      }

      if (parcel.status === "accepted") {
        return res.status(400).json({
          message:
            "This parcel has already been accepted by another delivery partner.",
        });
      }

      // Find the delivery partner making the request
      const partner = await DeliveryPartner.findOne({ userId: req.user.id });
      if (!partner) {
        return res.status(404).json({ message: "Delivery partner not found." });
      }

      // Update the parcel status to 'accepted' and associate with this partner
      parcel.status = "accepted";
      parcel.assignedTo = partner._id;
      await parcel.save();

      // Mark the delivery partner as booked
      partner.isBooked = true;
      partner.assignedParcels = [...(partner.assignedParcels || []), parcelId]; // Keep track of parcels assigned
      await partner.save();

      res.json({
        message: "Parcel accepted successfully.",
        parcel,
        partner,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
