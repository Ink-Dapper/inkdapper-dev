import { v2 as cloudinary } from "cloudinary";
import Review from "../models/reviewModel.js"

//function for  review products
const postProductReview = async (req, res) => {
    try {
        const { reviewDesc, productId, rating, usersName, reviewSub } = req.body;
        const productReview = new Review({ reviewDesc, productId, rating, usersName, reviewSub });
        console.log(usersName)
        await productReview.save();
        res.json({ success: true, message: "Product Review Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//function for list products
const getProductReview = async (req,res) => {

    try {
        const products = await Review.find({});
        res.json({success:true,message:"Products Listed",products})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export { postProductReview, getProductReview }