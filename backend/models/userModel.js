import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName:  { type: String, default: '' },
    email:     { type: String, default: '' },
    street:    { type: String, default: '' },
    city:      { type: String, default: '' },
    state:     { type: String, default: '' },
    zipcode:   { type: String, default: '' },
    country:   { type: String, default: '' },
    phone:     { type: String, default: '' },
}, { _id: false })

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: { type: Number, required: true, unique: true  },
    cartData: {type: Object, default: {}},
    wishlistData: {type: Object, default: {}},
    customData: {type: Object, default: {}},
    creditPoints: { type: Number, default: 0 },
    avatar: { type: String, default: '' },
    resetCode: { type: String },
    resetCodeExpiry: { type: Date },
    savedAddresses: { type: [addressSchema], default: [] },
    //ReturnsOrders: { type: Number, default: 0 }
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel