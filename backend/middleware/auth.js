import jwt from 'jsonwebtoken'

const authUser = async (req,res,next) => {
    const { token } = req.headers

    if (!token) {
        return res.status(401).json({success:false, message: 'Not Authorized Login Again'})
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';
        const token_decode = jwt.verify(token, jwtSecret)
        req.userId = token_decode.id
        next()
    } catch (error) {
        console.log('Token verification failed:', error.message)
        return res.status(401).json({success:false, message: error.message })
    }
}

export default authUser