const Parcel = require("../models/parcel");
const { DeliveryPartner } = require("../models/deliveryPartner");
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
      // Calculate the price based on the vehicle type, distance, and any additional fees
      const price = calculatePrice(vehicleType, distance);

      const parcel = new Parcel({
        from,
        to,
        vehicleType,
        distance,
        productType,
        serviceLevel,
        weight,
        price,
        userId: req.user.id,
        trackingNumber: `PKG${Date.now()}${Math.floor(Math.random() * 1000)}`,
      });

      await parcel.save();
      res.status(201).json(parcel);
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
};
