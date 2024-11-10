const mongoose= require("mongoose")
const parcelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trackingNumber: { type: String, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  quantity: { type: Number, required: true },
  productType: { type: String, required: true },
  urgency: {
    type: String,
    enum: ['regular', 'express'],
    default: 'regular'
  },
  transportType: {
    type: String,
    enum: ['road', 'air', 'rail'],
    default: 'road'
  },
  dimensions: {
    weight: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  packing: {
    required: { type: Boolean, default: false },
    type: Object
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
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

exports.Parcel = mongoose.model('Parcel', parcelSchema);