const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
      validate: {
        validator: function () {
          return !this.isBooked;
        },
        message: "The delivery partner is already booked.",
      },
    },
    assignedParcels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parcel" }],
    vehicleInfo: {
      vehicleRegistrationNumber: { type: String, required: true },
      vehicleType: { type: String, required: true },
      vehicleModel: String,
      vehicleYear: Number,
      vehicleRegistrationFileUrl: String,
      pollutionCertificateFileUrl: String,
    },
    documents: {
      aadharNumber: { type: String, required: true },
      aadharFileUrl: String,
      drivingLicenseNumber: { type: String, required: true },
      drivingLicenseFileUrl: String,
    },
    bankAccount: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      ifscCode: { type: String, required: true },
    },
    stats: {
      totalParcels: { type: Number, default: 0 },
      bidsSubmitted: { type: Number, default: 0 },
      pendingDeliveries: { type: Number, default: 0 },
      successfulDeliveries: { type: Number, default: 0 },
      cancelledDeliveries: { type: Number, default: 0 },
      monthlyEarnings: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
      averageDeliveryTime: { type: Number, default: 0 },
      bidSuccessRate: { type: Number, default: 0 },
      customerRatings: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

exports.DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
