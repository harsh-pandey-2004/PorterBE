// const mongoose= require("mongoose")
// const parcelSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   trackingNumber: { type: String, unique: true },
//   from: { type: String, required: true },
//   to: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   productType: { type: String, required: true },
//   urgency: {
//     type: String,
//     enum: ['regular', 'express'],
//     default: 'regular'
//   },
//   transportType: {
//     type: String,
//     enum: ['bike', 'auto-rickshaw', 'van','mini-truck','truck','container'],
//     default: 'bike'
//   },
//   dimensions: {
//     weight: { type: Number, required: true },
//     width: { type: Number, required: true },
//     height: { type: Number, required: true }
//   },
//   packing: {
//     required: { type: Boolean, default: false },
//     type: Object
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
//   deliveryBids: [{
//     partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
//     price: Number,
//     status: {
//       type: String,
//       enum: ['pending', 'accepted', 'rejected'],
//       default: 'pending'
//     },
//     createdAt: { type: Date, default: Date.now }
//   }]
// }, { timestamps: true });

// exports.Parcel = mongoose.model('Parcel', parcelSchema);

const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trackingNumber: { type: String, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  quantity: { type: Number, required: true },
  productType: { type: String },
  urgency: {
    type: String,
    enum: ['regular', 'express'],
    default: 'regular'
  },
  transportType: {
    type: String,
    enum: ['bike', 'autoRickshaw', 'van', 'miniTruck', 'truck', 'container'],
    default: 'bike'
  },
  dimensions: {
    weight: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  packing: {
    required: { type: Boolean, default: false },
    type: { type: String, default: 'standard' }
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
  deliveryBids: [{
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    price: Number,

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
