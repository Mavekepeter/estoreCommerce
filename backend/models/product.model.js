import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    image:{
        type:String,
        required:[true,'Image is required']
    },
    category:{
        type:String,
        required: true,
    },
    isFeatured:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const product = mongoose.model("products",productSchema);
export default product