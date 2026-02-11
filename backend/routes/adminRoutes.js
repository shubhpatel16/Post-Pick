import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { exportSalesCSV } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/export-csv', protect, admin, exportSalesCSV);

export default router;
