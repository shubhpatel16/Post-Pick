import express from "express";
import { applyCoupon, getCoupons } from "../controllers/couponController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyCoupon);
router.get('/', getCoupons);
export default router;