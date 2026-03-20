import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, userDetails, clearCreditPoints, countReturnedOrders, verifyRazorpay } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)
orderRouter.post('/razorpay',authUser, placeOrderRazorpay)

//verify payment
orderRouter.post('/verify-razorpay',authUser, verifyRazorpay)


//User Feature
orderRouter.post('/user-orders', authUser, userOrders)

//User Details
orderRouter.post('/user-details', authUser, userDetails)

// Route to get credit points
orderRouter.post('/credit-clear', authUser , clearCreditPoints);

// Route to count returned orders
orderRouter.get('/count-returned-orders', authUser, countReturnedOrders)

export default orderRouter