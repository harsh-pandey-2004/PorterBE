const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trackingNumber: { type: String, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  quantity: { type: Number, required: false },
  productType: { type: String, required: true },
  urgency: {
    type: String,
    enum: ['regular', 'express'],
    default: 'regular'
  },
  price: { type: Number },
  transportType: {
    type: String,
    enum: ['road', 'air', 'rail'],
    default: 'road'
  },
  dimensions: {
    weight: { type: Number }, 
    width: { type: Number },
    height: { type: Number }
  },
  packing: { 
    type: {
      material: { type: String },
      cost: { type: Number }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
  deliveryBids: [{
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
    price: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  }],
  additionalNotes: { type: String }
}, { timestamps: true });

// Export the model
const Parcel = mongoose.model('Parcel', parcelSchema);
module.exports = Parcel;
