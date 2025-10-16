import express from 'express'
import { loginUser, registerUser, adminLogin, profileUser, checkPhone, usersList, sendResetCode, resetPassword } from '../controllers/userController.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router()

// Debug middleware for user routes
userRouter.use((req, res, next) => {
  console.log('🔍 User Router Request:', {
    method: req.method,
    path: req.path,
    url: req.url,
    body: req.body
  });
  next();
});

userRouter.post('/register', registerUser)
userRouter.post('/login', (req, res) => {
  console.log('🔍 Login route handler called:', {
    method: req.method,
    path: req.path,
    url: req.url,
    body: req.body,
    headers: req.headers
  });
  loginUser(req, res);
})
userRouter.post('/admin', adminLogin)
userRouter.post('/check-phone', checkPhone)
userRouter.post('/profile', authUser, profileUser)
userRouter.post('/users-list', usersList)
userRouter.post('/send-reset-code', sendResetCode)
userRouter.post('/reset-password', resetPassword)


export default userRouter