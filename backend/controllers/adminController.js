import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { Parser } from 'json2csv';

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

  const topSellingProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalSold: { $sum: '$orderItems.qty' },
        revenue: {
          $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] },
        },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const deliveredOrders = await Order.countDocuments({ isDelivered: true });
  //   const paidOrders = await Order.countDocuments({ isPaid: true });
  //   const unpaidOrders = await Order.countDocuments({ isPaid: false });

  const customerGrowth = await User.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const revenueHeatmap = await Order.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        total: { $sum: '$totalPrice' },
      },
    },
  ]);

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
    topSellingProducts,
    deliveredOrders,
    customerGrowth,
    revenueHeatmap,
  });
});

const exportSalesCSV = asyncHandler(async (req, res) => {
    const orders = await Order.find({ isPaid: true }).populate(
      'user',
      'name email'
    );

    const fields = ['orderId', 'customer', 'email', 'totalPrice', 'createdAt'];

    const data = orders.map((order) => ({
      orderId: order._id,
      customer: order.user?.name,
      email: order.user?.email,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('sales-report.csv');
    res.send(csv);
  });

export { getDashboardStats, exportSalesCSV };

