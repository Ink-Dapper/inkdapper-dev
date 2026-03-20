import express from 'express'
import { addToWishlist, updateWishlist, getUserWishlist, removeWishlist } from '../controllers/wishlistController.js'
import authUser from '../middleware/auth.js'

const wishlistRouter = express.Router()

wishlistRouter.post('/add',authUser, addToWishlist)
wishlistRouter.post('/update',authUser, updateWishlist)
wishlistRouter.post('/get',authUser, getUserWishlist)
wishlistRouter.post('/remove', authUser, removeWishlist);

export default wishlistRouter