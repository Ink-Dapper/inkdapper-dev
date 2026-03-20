import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewDesc: {type: String,required: true},
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming you have a Product model
        required: true,
    },
    date: {type: Date,default: Date.now},
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    usersName: {type: String, required: true},
    reviewSub: {type: String, required: true}
});

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);

export default reviewModel;