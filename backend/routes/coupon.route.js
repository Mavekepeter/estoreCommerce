import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCoupon,validateCoupon } from '../controller/coupon.controller.js';
const router = express.Router();

router.get("/",protectRoute,getCoupon)
router.post("/validate", protectRoute, validateCoupon);

export default router;