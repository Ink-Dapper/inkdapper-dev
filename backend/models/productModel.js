import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description : {type: String, required: true},
    beforePrice : {type: Number, required: true},
    price : {type: Number, required: true},
    image : {type: Array, required: true},
    reviewImage : {type: Array, required: true},
    code : {type: String, required: true},
    category : {type: String, required: true},
    subCategory : {type: String, required: true},
    sizes : {type: Array, required: true},
    colors : {type: Array, required: false},
    bestseller : {type: Boolean},
    soldout : {type: Boolean, default: false},
    date : {type: Number, required: true},
    slug: {type: String, required: false},
    comboPrices: [{
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        discount: {type: Number, default: 0}
    }]
})

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel