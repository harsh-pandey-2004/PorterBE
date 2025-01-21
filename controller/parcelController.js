const Parcel = require("../models/parcel");
const { DeliveryPartner } = require("../models/deliveryPartner");
const { User } = require("../models/user");
const pricingRules = {
  "Tata Ace": {
    baseFare: 300,
    rates: [
      { maxDistance: 4, rate: 52 },
      { maxDistance: 9, rate: 42 },
      { maxDistance: 99, rate: 26 },
      { maxDistance: 249, rate: 20 },
      { maxDistance: Infinity, rate: 15 },
    ],
  },
  "Mahindra Pick up": {
    baseFare: 450,
    rates: [
      { maxDistance: 4, rate: 64 },
      { maxDistance: 9, rate: 54 },
      { maxDistance: 99, rate: 36 },
      { maxDistance: 249, rate: 30 },
      { maxDistance: Infinity, rate: 20 },
    ],
  },
  "Three wheeler": {
    baseFare: 120,
    rates: [
      { maxDistance: 4, rate: 39 },
      { maxDistance: 9, rate: 35 },
      { maxDistance: 99, rate: 21 },
      { maxDistance: 249, rate: 12 },
      { maxDistance: Infinity, rate: 8 },
    ],
  },
  "Ev 3 wheeler": {
    baseFare: 70,
    rates: [
      { maxDistance: 4, rate: 25 },
      { maxDistance: 9, rate: 20 },
      { maxDistance: 50, rate: 10 },
    ],
  },
  Bike: {
    baseFare: 75,
    rates: [
      { maxDistance: Infinity, rate: 7 }, // Flat rate per km
    ],
  },
};
const calculatePrice = (vehicleType, distance, additionalFees = {}) => {
  const pricing = pricingRules[vehicleType];
  console.log(pricing);
  if (!pricing) throw new Error("Invalid vehicle type");

  let cost = pricing.baseFare;
  let distanceCost = 0;

  for (const rate of pricing.rates) {
    if (distance <= rate.maxDistance) {
      distanceCost = distance * rate.rate;
      break;
    }
  }


  cost += distanceCost;

  // Add GST
  const gst = 0.18 * cost;
  cost += gst;

  // Add any additional fees
  for (const fee of Object.values(additionalFees)) {
    cost += fee;
  }


  return cost;
};
module.exports = {
  createParcel: async (req, res) => {
    try {
      const {
        from,
        to,
        vehicleType,
        distance,
        productType,
        serviceLevel,
        weight,
      } = req.body;

      // Validate input
      if (
        !from ||
        !to ||
        !vehicleType ||
        !distance ||
        !productType ||
        !weight
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const price = calculatePrice(vehicleType, distance);

      // const deliveryPartner = await User.findOneAndUpdate(
      //   {
      //     role: "delivery_partner",
      //     "address.city": from.city,
      //   },
      //   { $set: { isRequestcome: true } },
      //   { new: true }
      // );

      // if (!deliveryPartner) {
      //   return res.status(404).json({
      //     message: "No delivery partner found in the specified city.",
      //   });
      // }

      // Create a new parcel
      const parcel = new Parcel({
        from,
        to,
        vehicleType,
        distance,
        productType,
        serviceLevel,
        weight,
        price,
        userId: req.user.id, // Assuming authenticated user
        // deliveryPartnerId: deliveryPartner._id, // Save delivery partner info
        trackingNumber: `PKG${Date.now()}${Math.floor(Math.random() * 1000)}`,
      });

      await parcel.save();

      res.status(201).json({ parcel, deliveryPartner })

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getParcelHistory: async (req, res) => {
    try {
      const parcels = await Parcel.find({ userId: req.user.id })
        .populate("assignedTo", "vehicleInfo.vehicleType")
        .sort({ createdAt: -1 });
      res.json(parcels);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  trackParcel: async (req, res) => {
    try {
      const parcel = await Parcel.findOne({
        trackingNumber: req.params.trackingNumber,
      }).populate("assignedTo", "vehicleInfo.vehicleType");

      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found" });
      }

      res.json(parcel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteParcel: async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const deletedParcel = await Parcel.findOneAndDelete({ trackingNumber });
      if (!deletedParcel) {
        return res.status(404).json({ message: "Parcel not found" });
      }
      res.status(200).json({ message: "Parcel deleted successfully", deletedParcel });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getParcelOffers: async (req, res) => {
    try {
      const parcel = await Parcel.findById(req.params.parcelId).populate(
        "deliveryBids.partnerId",
        "vehicleInfo"
      );

      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found" });
      }

      res.json(parcel.deliveryBids);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAvailableParcels: async (req, res) => {
    try {
        const { city, vehicleType } = req.query;

        // Validate input
        if (!city || !vehicleType) {
            return res.status(400).json({ message: "City and vehicle type are required." });
        }

        // Find parcels that are not assigned and match the city and vehicle type
        const parcels = await Parcel.find({
            "from": city,
            "vehicleType": vehicleType,
            "assignedTo": { $exists: false },
            "status": "orderplaced"
        });

        if (!parcels.length) {
            return res.status(404).json({ message: "No available parcels found." });
        }

        res.status(200).json(parcels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

acceptParcel: async (req, res) => {
    try {
        const { parcelId } = req.body;

        // Validate input
        if (!parcelId) {
            return res.status(400).json({ message: "Parcel ID is required." });
        }

        const deliveryPartnerId = req.user.id; // Assuming the user is authenticated as a delivery partner

        // Find the parcel and check if it is already assigned
        const parcel = await Parcel.findOne({
            _id: parcelId,
            assignedTo: { $exists: false },
            status: "orderplaced"
        });

        if (!parcel) {
            return res.status(404).json({ message: "Parcel not available or already assigned." });
        }

        // Assign the parcel to the delivery partner and update status
        parcel.assignedTo = deliveryPartnerId;
        parcel.status = "pickup";
        await parcel.save();

        res.status(200).json({ message: "Parcel accepted successfully.", parcel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

};
