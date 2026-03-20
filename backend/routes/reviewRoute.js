import express from 'express'
import { postProductReview, getProductReview } from '../controllers/reviewController.js'
import upload from '../middleware/multer.js'
import authUser from '../middleware/auth.js'

const reviewRouter = express.Router()
reviewRouter.post('/post',postProductReview)
reviewRouter.get('/get',getProductReview)

export default reviewRouter