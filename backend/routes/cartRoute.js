import express from 'express'
import { addToCart, getUserCart, updateCart, addToCartCustom, getUserCustomData, updateCustom } from '../controllers/cartController.js'
import upload from "../middleware/multer.js";
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateCart)
cartRouter.post('/update-custom',authUser, updateCustom)
cartRouter.post('/get-custom',authUser, getUserCustomData)
cartRouter.post('/custom', authUser , upload.fields([{ name: "reviewImageCustom"}, { name: "rawDesignImage" }]), addToCartCustom);

export default cartRouter