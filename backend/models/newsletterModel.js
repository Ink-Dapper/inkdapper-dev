import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    interests: [{
        type: String,
        trim: true
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    subscriptionDate: {
        type: Date,
        default: Date.now
    },
    lastEmailSent: {
        type: Date
    },
    emailCount: {
        type: Number,
        default: 0
    },
    source: {
        type: String,
        default: 'website'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for better query performance
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ subscriptionDate: -1 });
// Note: email index is already created by unique: true in schema

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
