const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingNumber: { type: String, unique: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    quantity: { type: Number },
    productType: { type: String, required: true },
    serviceLevel: {
      type: String,
      enum: ["regular", "express"],
      default: "regular",
    },
    price: { type: Number },
    vehicleType: {
      type: String,
      enum: [
        "Tata Ace",
        "Mahindra Pick up",
        "Three wheeler",
        "Ev 3 wheeler",
        "Bike",
      ],
      default: "Bike",
    },
    dimensions: {
      weight: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    packing: {
      material: { type: String },
      cost: { type: Number },
    },
    status: {
      type: String,
      enum: [
        "orderplaced",
        "pickup",
        "in_transit",
        "out for delivery",
        "delivered",
        "cancelled",
      ],
      default: "orderplaced",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
    deliveryBids: [
      {
        partnerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DeliveryPartner",
        },
        price: { type: Number },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    additionalNotes: { type: String },
  },
  { timestamps: true }
);

parcelSchema.pre("save", function (next) {
  if (this.status === "accepted" && this.assignedTo) {
    return next(new Error("Parcel is already assigned to another delivery partner."));
  }
  next();
});

module.exports = mongoose.model("Parcel", parcelSchema);
