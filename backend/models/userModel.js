import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: { type: Number, required: true, unique: true  },
    cartData: {type: Object, default: {}},
    wishlistData: {type: Object, default: {}},
    customData: {type: Object, default: {}},
    creditPoints: { type: Number, default: 0 },
    resetCode: { type: String },
    resetCodeExpiry: { type: Date },  
    //ReturnsOrders: { type: Number, default: 0 }
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel