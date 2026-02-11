import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();

  const orders = await Order.find({});
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const recentOrders = await Order.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // 📊 Monthly revenue aggregation
  const monthlyRevenue = await Order.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 📦 Low stock products
  const lowStockProducts = await Product.find({
    countInStock: { $lte: 5 },
  }).select('name countInStock');

  // 💳 Paid vs Unpaid
  const paidOrders = await Order.countDocuments({ isPaid: true });
  const unpaidOrders = await Order.countDocuments({ isPaid: false });

  res.json({
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
    recentOrders,
    monthlyRevenue,
    lowStockProducts,
    paidOrders,
    unpaidOrders,
  });
});

export { getDashboardStats };
