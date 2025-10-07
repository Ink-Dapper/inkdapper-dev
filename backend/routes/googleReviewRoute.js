import express from 'express';
import { 
    syncGoogleReviews, 
    getGoogleReviews, 
    getGoogleReviewsStats, 
    getCombinedReviews 
} from '../controllers/googleReviewController.js';

const googleReviewRouter = express.Router();

// Sync Google reviews from Google Places API
googleReviewRouter.post('/sync', syncGoogleReviews);

// Get Google reviews with filtering and pagination
googleReviewRouter.get('/get', getGoogleReviews);

// Get Google reviews statistics
googleReviewRouter.get('/stats', getGoogleReviewsStats);

// Get combined reviews (Google + regular reviews)
googleReviewRouter.get('/combined', getCombinedReviews);

export default googleReviewRouter;
