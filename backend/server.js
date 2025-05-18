import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import bodyParser from 'body-parser';
import newsLetterRoute from './routes/newsLetterRoute.js'
import emailRouter from './routes/emailRoute.js'
import path from 'path'
import { fileURLToPath } from 'url'

// App config
const app = express()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')))

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/review', reviewRouter)
app.use('/api/newsletter', newsLetterRoute)
app.use('/api/email', emailRouter)

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/sitemap.xml'))
})

// Handle all other routes for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})