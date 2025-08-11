import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
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

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
