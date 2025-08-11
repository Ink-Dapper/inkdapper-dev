import express from 'express'
import { 
    subscribeToNewsletter, 
    getAllSubscribers, 
    getSubscriberById,
    updateSubscriberStatus, 
    deleteSubscriber, 
    getSubscriberStats 
} from '../controllers/newsLetterController.js'
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const newsLetterRoute = express.Router()

// Public routes
newsLetterRoute.post('/subscribe', subscribeToNewsletter)

// Admin routes (protected)
newsLetterRoute.get('/subscribers', adminAuth, getAllSubscribers)
newsLetterRoute.get('/subscribers/:id', adminAuth, getSubscriberById)
newsLetterRoute.put('/subscribers/:id', adminAuth, updateSubscriberStatus)
newsLetterRoute.delete('/subscribers/:id', adminAuth, deleteSubscriber)
newsLetterRoute.get('/stats', adminAuth, getSubscriberStats)

export default newsLetterRoute