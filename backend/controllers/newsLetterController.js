import Newsletter from '../models/newsletterModel.js';

// Simple newsletter subscription - just store email
const subscribeToNewsletter = async (req, res) => {
    try {
        console.log('Newsletter subscription request received:', req.body);
        
        const { email } = req.body;
        
        if (!email) {
            console.log('Email is missing from request');
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        console.log('Processing subscription for email:', email);

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            console.log('Email already exists:', email);
            return res.status(400).json({ success: false, message: 'Email already subscribed to newsletter' });
        }

        // Create new subscriber - just email
        const subscriberData = {
            email: email.toLowerCase(),
            isVerified: true,
            subscriptionDate: new Date()
        };

        console.log('Saving subscriber data:', subscriberData);

        const newSubscriber = new Newsletter(subscriberData);
        const savedSubscriber = await newSubscriber.save();
        
        console.log('Subscriber saved successfully with ID:', savedSubscriber._id);

        res.json({ 
            success: true, 
            message: 'Subscription successful! Welcome to Ink Dapper newsletter.' 
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
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

export { 
    subscribeToNewsletter, 
    getAllSubscribers, 
    getSubscriberById,
    updateSubscriberStatus, 
    deleteSubscriber, 
    getSubscriberStats,
    updateLastEmailSent
};