import express from 'express'
import { verificationEmail, verifyEmail } from '../controllers/emailVerificationController.js'
import authUser from '../middleware/auth.js'

const emailRouter = express.Router()
emailRouter.post('/send-verification-email',verificationEmail)
emailRouter.post('/verify-email',verifyEmail)

export default emailRouter