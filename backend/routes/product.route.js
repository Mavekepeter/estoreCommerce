import express from 'express'
import { createproduct, deleteproduct, getAllproducts, getFeaturedProducts, getProductsByCategory, getRecommendations, toggleFeaturedProduct } from '../controller/product.controller.js';
import { protectRoute,adminRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get("/", protectRoute,adminRoute,getAllproducts)
router.get("/featured" ,getFeaturedProducts)
router.get("/category/:category",getProductsByCategory)
router.get("/recommendations" ,getRecommendations)
router.post("/", protectRoute,adminRoute,createproduct);
router.patch("/:id", protectRoute,adminRoute,toggleFeaturedProduct);
router.delete("/:id", protectRoute,adminRoute,deleteproduct)


export default router 