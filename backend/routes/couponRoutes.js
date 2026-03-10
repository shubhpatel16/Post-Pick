import express from "express";
import { 
  applyCoupon, 
  getCoupons, 
  createCoupon, 
  deleteCoupon,
  updateCoupon
} from "../controllers/couponController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCoupons);
router.post("/apply", protect, applyCoupon);

// admin
router.post("/", protect, admin, createCoupon);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

export default router;