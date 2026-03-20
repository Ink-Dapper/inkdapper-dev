import mongoose from 'mongoose'

const highlightedProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    date: { type: Number, required: true }
})

export default mongoose.model('HighlightedProduct', highlightedProductSchema)
