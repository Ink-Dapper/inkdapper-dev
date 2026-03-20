import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    wishlistData: {type: Object, default: {}}
});

const wishlistModel = mongoose.models.wishlist || mongoose.model('wishlist', wishlistSchema);

export default wishlistModel;