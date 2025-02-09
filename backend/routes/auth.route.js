import express from "express"
import { login, logout, signup,refleshToken, getprofile } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/refresh-token",refleshToken)
router.get("/profile",protectRoute,getprofile)

export default router