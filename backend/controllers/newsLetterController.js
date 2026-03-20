import Newsletter from '../models/newsletterModel.js';

// Newsletter subscription - handle both logged-in users and anonymous users
const subscribeToNewsletter = async (req, res) => {
    try {
        console.log('Newsletter subscription request received:', req.body);
        console.log('Request headers:', req.headers);
        
        const { name, email, phone, interests } = req.body;
        const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        
        if (!email) {
            console.log('Email is missing from request');
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        console.log('Processing subscription for:', { name, email, phone, interests, hasToken: !!token });

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            console.log('Email already exists:', email);
            return res.status(400).json({ success: false, message: 'Email already subscribed to newsletter' });
        }

        let subscriberName = name ? name.trim() : '';
        let subscriberPhone = phone ? phone.trim() : undefined;
        let source = 'website';

        // If user is logged in, try to get their user details
        if (token) {
            try {
                const jwt = await import('jsonwebtoken');
                const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
                
                // Import user model
                const userModel = (await import('../models/userModel.js')).default;
                const user = await userModel.findById(decoded.id);
                
                if (user) {
                    console.log('Found logged-in user:', user.name, user.email);
                    // Always use user's account information for logged-in users
                    subscriberName = user.name;
                    subscriberPhone = user.phone ? user.phone.toString() : '';
                    source = 'logged-in-user';
                    console.log('Using user account data for subscription - Name:', subscriberName, 'Phone:', subscriberPhone);
                } else {
                    console.log('User not found in database, using form data');
                }
            } catch (tokenError) {
                console.log('Token verification failed, using form data:', tokenError.message);
                // If token is invalid, fall back to form data
            }
        }

        // If no name provided and no logged-in user, use email prefix as name
        if (!subscriberName || subscriberName.trim() === '') {
            subscriberName = email.split('@')[0];
        }
        
        // Final fallback to ensure name is never empty
        if (!subscriberName || subscriberName.trim() === '') {
            subscriberName = 'Newsletter Subscriber';
        }

        // Create new subscriber with all details
        const subscriberData = {
            name: subscriberName,
            email: email.toLowerCase(),
            phone: subscriberPhone,
            interests: interests && interests.length > 0 ? interests : [],
            isVerified: true,
            subscriptionDate: new Date(),
            source: source
        };

        console.log('Final subscriber data before saving:', subscriberData);
        console.log('Name validation - subscriberName:', subscriberName, 'isEmpty:', !subscriberName || subscriberName.trim() === '');

        const newSubscriber = new Newsletter(subscriberData);
        const savedSubscriber = await newSubscriber.save();
        
        console.log('Subscriber saved successfully with ID:', savedSubscriber._id);

        res.json({ 
            success: true, 
            message: 'Subscription successful! Welcome to Ink Dapper newsletter.' 
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error: ' + validationErrors.join(', '),
                errors: validationErrors
            });
        }
        
        // Handle duplicate key error (email already exists)
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already subscribed to newsletter' 
            });
        }
        
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all newsletter subscribers (admin only)
const getAllSubscribers = async (req, res) => {
    try {
        console.log('Fetching all subscribers...');
        const subscribers = await Newsletter.find({})
            .sort({ subscriptionDate: -1 })
            .select('-__v');
        
        console.log(`Found ${subscribers.length} subscribers`);
        res.json({ success: true, data: subscribers });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get subscriber by ID (admin only)
const getSubscriberById = async (req, res) => {
    try {
        const { id } = req.params;
        const subscriber = await Newsletter.findById(id).select('-__v');
        
        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }
        
        res.json({ success: true, data: subscriber });
    } catch (error) {
        console.error('Get subscriber by ID error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update subscriber status (admin only)
const updateSubscriberStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive, notes, emailCount, source } = req.body;

        const updateData = { isActive, notes };
        if (emailCount !== undefined) updateData.emailCount = emailCount;
        if (source !== undefined) updateData.source = source;

        const subscriber = await Newsletter.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }

        res.json({ success: true, data: subscriber });
    } catch (error) {
        console.error('Update subscriber error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete subscriber (admin only)
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        const subscriber = await Newsletter.findByIdAndDelete(id);

        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }

        res.json({ success: true, message: 'Subscriber deleted successfully' });
    } catch (error) {
        console.error('Delete subscriber error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get subscriber statistics (admin only)
const getSubscriberStats = async (req, res) => {
    try {
        const totalSubscribers = await Newsletter.countDocuments({});
        const activeSubscribers = await Newsletter.countDocuments({ isActive: true });
        const verifiedSubscribers = await Newsletter.countDocuments({ isVerified: true });
        
        // Get subscribers from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSubscribers = await Newsletter.countDocuments({
            subscriptionDate: { $gte: thirtyDaysAgo }
        });

        res.json({
            success: true,
            data: {
                total: totalSubscribers,
                active: activeSubscribers,
                verified: verifiedSubscribers,
                recent: recentSubscribers
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update last email sent date (for when newsletters are sent)
const updateLastEmailSent = async (subscriberId) => {
    try {
        await Newsletter.findByIdAndUpdate(
            subscriberId,
            { 
                lastEmailSent: new Date(),
                $inc: { emailCount: 1 }
            }
        );
    } catch (error) {
        console.error('Error updating last email sent:', error);
    }
};

// Check if email is already subscribed
const checkSubscriptionStatus = async (req, res) => {
    try {
        console.log('Checking subscription status for:', req.body);
        
        const { email } = req.body;
        
        if (!email) {
            console.log('Email is missing from request');
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        console.log('Checking subscription for email:', email);

        // Check if email exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        
        if (existingSubscriber) {
            console.log('Email is subscribed:', email);
            return res.json({ 
                success: true, 
                isSubscribed: true,
                message: 'Email is already subscribed to newsletter' 
            });
        } else {
            console.log('Email is not subscribed:', email);
            return res.json({ 
                success: true, 
                isSubscribed: false,
                message: 'Email is not subscribed to newsletter' 
            });
        }
    } catch (error) {
        console.error('Check subscription status error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export { 
    subscribeToNewsletter, 
    getAllSubscribers, 
    getSubscriberById,
    updateSubscriberStatus, 
    deleteSubscriber, 
    getSubscriberStats,
    updateLastEmailSent,
    checkSubscriptionStatus
};