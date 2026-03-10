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

  const usedCoupon = await Order.findOne({
    user: req.user._id,
    couponUsed: code,
  });

  if (usedCoupon) {
    res.status(400);
    throw new Error('You have already used this coupon');
  }

  if (!coupon.isActive) {
    res.status(400);
    throw new Error('Coupon not active');
  }

  // Check coupon expiry
  if (coupon.expiryDate && coupon.expiryDate < Date.now()) {
    res.status(400);
    throw new Error('Coupon has expired');
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

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, vipOnly, minOrderAmount, expiryDate } = req.body;

  const couponExists = await Coupon.findOne({ code });

  if (couponExists) {
    res.status(400);
    throw new Error('Coupon already exists');
  }

  const coupon = await Coupon.create({
    code,
    discount,
    vipOnly,
    minOrderAmount,
    expiryDate,
  });

  res.status(201).json(coupon);
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  await coupon.deleteOne();

  res.json({ message: 'Coupon removed' });
});

// @desc Update coupon
// @route PUT /api/coupons/:id
// @access Admin

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  coupon.code = req.body.code ?? coupon.code;
  coupon.discount = req.body.discount ?? coupon.discount;
  coupon.minOrderAmount = req.body.minOrderAmount ?? coupon.minOrderAmount;
  coupon.expiryDate = req.body.expiryDate ?? coupon.expiryDate;

  coupon.isActive =
    req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;
  const updatedCoupon = await coupon.save();

  res.json(updatedCoupon);
});
