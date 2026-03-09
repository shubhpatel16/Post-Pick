import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

export const checkVIP = asyncHandler(async (req, res) => {

  const orders = await Order.find({ user: req.user._id })

  const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0)

  const isVIP = totalSpent >= 5000 || orders.length >= 5

  res.json({
    isVIP,
    totalSpent,
    orders: orders.length
  })

})