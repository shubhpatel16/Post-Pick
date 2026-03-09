import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;

  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon');
  }

  if (!coupon.isActive) {
    res.status(400);
    throw new Error('Coupon not active');
  }

  if (orderTotal < coupon.minOrderAmount) {
    res.status(400);
    throw new Error('Order amount too low for this coupon');
  }

  const userOrders = await Order.find({ user: req.user._id });

  const totalSpent = userOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );

  const isVIP = totalSpent >= 5000 || userOrders.length >= 5;

  if (coupon.vipOnly && !isVIP) {
    res.status(403);
    throw new Error('Coupon available only for VIP customers');
  }

  const discountAmount = (orderTotal * coupon.discount) / 100;

  res.json({
    discount: discountAmount,
    finalTotal: orderTotal - discountAmount,
  });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({ isActive: true });

  res.json(coupons);
});