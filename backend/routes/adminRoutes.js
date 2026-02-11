import express from 'express';
const router = express.Router();
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/dashboard', protect, admin, getDashboardStats);

export default router;
