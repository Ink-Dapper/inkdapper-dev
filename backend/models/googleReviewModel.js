import mongoose from 'mongoose';

const googleReviewSchema = new mongoose.Schema({
    // Google-specific fields
    googleReviewId: {
        type: String,
        required: true,
        unique: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorUrl: {
        type: String,
        default: null
    },
    profilePhotoUrl: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        default: ''
    },
    time: {
        type: Number, // Unix timestamp
        required: true
    },
    relativeTimeDescription: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: 'en'
    },
    source: {
        type: String,
        default: 'google',
        enum: ['google']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    // Store original Google data for reference
    originalData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Index for efficient queries
googleReviewSchema.index({ googleReviewId: 1 });
googleReviewSchema.index({ rating: 1 });
googleReviewSchema.index({ time: -1 });
googleReviewSchema.index({ isActive: 1 });

// Virtual for formatted date
googleReviewSchema.virtual('formattedDate').get(function() {
    return new Date(this.time * 1000).toISOString();
});

// Method to get reviews by rating range
googleReviewSchema.statics.getByRatingRange = function(minRating, maxRating = 5) {
    return this.find({
        rating: { $gte: minRating, $lte: maxRating },
        isActive: true
    }).sort({ time: -1 });
};

// Method to get recent reviews
googleReviewSchema.statics.getRecent = function(limit = 10) {
    return this.find({ isActive: true })
        .sort({ time: -1 })
        .limit(limit);
};

// Method to get average rating
googleReviewSchema.statics.getAverageRating = function() {
    return this.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
};

const GoogleReview = mongoose.models.GoogleReview || mongoose.model('GoogleReview', googleReviewSchema);

export default GoogleReview;
