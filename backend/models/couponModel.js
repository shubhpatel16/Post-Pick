import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    vipOnly: {
      type: Boolean,
      default: true,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;