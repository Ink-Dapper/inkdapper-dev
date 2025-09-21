import express from 'express'
import { getNotifications, markAsRead, getUnreadCount } from '../controllers/notificationController.js'
import adminAuth from '../middleware/adminAuth.js'

const notificationRouter = express.Router()

// Admin routes
notificationRouter.get('/', adminAuth, getNotifications)
notificationRouter.patch('/:id/read', adminAuth, markAsRead)
notificationRouter.get('/unread-count', adminAuth, getUnreadCount)

export default notificationRouter
