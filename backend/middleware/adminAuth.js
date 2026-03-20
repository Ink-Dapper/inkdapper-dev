import jwt from "jsonwebtoken";

const adminAuth = async (req,res,next) => {
    try {
        const { token } = req.headers
        
        if(!token) {
            return res.status(401).json({success:false, message: "Not Authorized Login Again"})
        }
        
        // Use default JWT secret if not set in environment
        const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@inkdapper.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        const token_decoded = jwt.verify(token, jwtSecret)
        
        if (token_decoded !== adminEmail + adminPassword) {
            return res.status(401).json({success:false, message: "Not Authorized Login Again"})
        }
        
        // Set userId for admin operations (using a special admin ID)
        req.userId = 'admin';
        
        next()
    } catch (error) {
        console.log('Admin auth error:', error)
        res.status(401).json({success:false,message: error.message})
    }
}

export default adminAuth