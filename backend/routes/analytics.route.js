import { getAnalyticsData, getDailySalesData } from "../controller/analytics.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import express from 'express';

const router = express.Router();
router.get("/",protectRoute,adminRoute, async(req,res)=>{
    try {
        const analyticsData = await getAnalyticsData();
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000 );
        const dailySalesData = await getDailySalesData(startDate,endDate);
        res.json({
            analyticsData,
            dailySalesData
        })
        
    } catch (error) {
        console.log("Error i analytics route",error.message);
        res.status(500).json({message:"server error",error:error.message})
        
    }
})
export default router;