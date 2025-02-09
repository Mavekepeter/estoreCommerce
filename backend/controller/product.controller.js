import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import product from "../models/product.model.js";
export const getAllproducts = async(req,res)=>{
    try {
        const products = await product.find({});
        res.json({products})
    } catch (error) {
        console.log("Error in getAllproducts Controller",error.message);
        res.status(500).json({message:"server error",error:error.message})
    }
}
export const getFeaturedProducts = async(req,res)=>{
    try {
      let featuredProducts =  await redis.get("featured_products")
      if (featuredProducts) {
        return res.json(JSON.parse(featuredProducts))
      }
      //if not in redis, fetch from mongodb
      featuredProducts = await product.find({isFeatured:true}).lean();
      if (!featuredProducts) {
        return res.status(404).json({message:"No featured product found"})
      }
      //store in redis for future quick access
      await redis.set("featured_products",JSON.stringify(featuredProducts));
      res.json(featuredProducts)
    } catch (error) {
        console.log("Error in getFeaturedProducts controller",error.message);
        res.status(500).json({message:"server error",error:error.message})
    }
}
export const createproduct = async(req,res)=>{
    try {
        const {name,description,price,image,category} = req.body;
        let cloudinaryResponse = null
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:"products"})
        }
        const products = await product.create({
            name,
            description,
            price,
            image:cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url :"",
            category
        })
        res.status(201).json(products)
    } catch (error) {
        console.log("Error in createProducts controller",error.message);
        res.status(500).json({message:"server error",error:error.message})
    }
}
export const deleteproduct = async(req,res)=>{
    try {
        const products = await product.findById(req.params.id)
        if (!products) {
            return res.status(404).json({message:"product not found"})
        }
        if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary");
            } catch (error) {
                console.log("deleted image from cloudinary",error);
            }
        }
        await product.findByIdAndDelete(req.params.id)
        res.json({message:"product deleted successfully"})
    } catch (error) {
        console.log("Error in deleteProducts controller",error.message);
        res.status(500).json({message:"server error",error:error.message})
    }
}
export const getRecommendations = async(req,res)=>{
    try {
        const products = await product.aggregate([
            {
                $sample:{size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ])
        res.json(products)
    } catch (error) {
        console.log("Error in getRecommendedProducts controller",error.message);
        res.status(500).json({message: "server error",error:error.message})
    }
}
export const getProductsByCategory = async(req,res)=>{
    const {category} = req.params;
    try {
        const products = await product.find({category});
        res.json({products});
    } catch (error) {
        console.log("Error in getProductsByCategory controller",error.message);
        res.status(500).json({message: "server error",error:error.message})
    }
}
export const toggleFeaturedProduct = async(req,res)=>{
    try {
        const products = await product.findById(req.params.id);
        if (products) {
            products.isFeatured = !products.isFeatured;
            const updatedProduct = await products.save();
            await updateFeaturedProductsCach();
            res.json(updatedProduct);
        }else{
            res.status(400).json({message:"product not found"})
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProducts controller",error.message);
        res.status(500).json({message: "server error",error:error.message})
    }
}
async function updateFeaturedProductsCach(){
    try {
        const featuredProducts = await product.find({isFeatured:true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("error in update cache function");
        
    }
}