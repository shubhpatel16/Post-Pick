import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // 🗓️ Date filter object
  const dateFilter = {};

  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // 📦 Orders with optional date filter
  const totalOrders = await Order.countDocuments(dateFilter);

  const orders = await Order.find(dateFilter);
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const recentOrders = await Order.find(dateFilter)
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // 📊 Monthly revenue
  const monthlyRevenue = await Order.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const lowStockProducts = await Product.find({
    countInStock: { $lte: 5 },
  }).select('name countInStock');

  const paidOrders = await Order.countDocuments({
    ...dateFilter,
    isPaid: true,
  });

  const unpaidOrders = await Order.countDocuments({
    ...dateFilter,
    isPaid: false,
  });

  const deliveredOrders = await Order.countDocuments({
    ...dateFilter,
    isDelivered: true,
  });

  const topSellingProducts = await Order.aggregate([
    { $match: dateFilter },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalSold: { $sum: '$orderItems.qty' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const customerGrowth = await User.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
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
    deliveredOrders,
    topSellingProducts,
    customerGrowth,
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

const exportSalesPDF = asyncHandler(async (req, res) => {
  const orders = await Order.find({});

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const doc = new PDFDocument();

  // 🔴 THIS PART IS CRITICAL
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="sales-report.pdf"'
  );

  doc.pipe(res);

  doc.fontSize(20).text('Post&Pick Sales Report', { align: 'center' });
  doc.moveDown();

  doc.fontSize(14).text(`Total Orders: ${orders.length}`);
  doc.text(`Total Revenue: ₹${totalRevenue}`);
  doc.moveDown();

  orders.forEach((order, index) => {
    doc.text(`${index + 1}. Order ID: ${order._id} | ₹${order.totalPrice}`);
  });

  doc.end();
});

export { getDashboardStats, exportSalesCSV, exportSalesPDF };
