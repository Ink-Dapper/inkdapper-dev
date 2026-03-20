import express from 'express'
import { loginUser, registerUser, adminLogin, profileUser, checkPhone, usersList, sendResetCode, resetPassword } from '../controllers/userController.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/check-phone', checkPhone)
userRouter.post('/profile', authUser, profileUser)
userRouter.post('/users-list', usersList)
userRouter.post('/send-reset-code', sendResetCode)
userRouter.post('/reset-password', resetPassword)


export default userRouter