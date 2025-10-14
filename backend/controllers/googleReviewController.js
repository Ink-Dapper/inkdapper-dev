import GoogleReview from '../models/googleReviewModel.js';
import GoogleReviewsService from '../services/googleReviewsService.js';

const googleReviewsService = new GoogleReviewsService();

/**
 * Fetch and sync Google reviews
 */
export const syncGoogleReviews = async (req, res) => {
    try {
        console.log('Starting Google reviews sync...');
        
        // Fetch reviews from Google API
        const googleReviews = await googleReviewsService.getReviews(true);
        
        if (!googleReviews || googleReviews.length === 0) {
            return res.json({
                success: true,
                message: 'No Google reviews found',
                syncedCount: 0
            });
        }

        let syncedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;

        // Process each review
        for (const reviewData of googleReviews) {
            try {
                const existingReview = await GoogleReview.findOne({
                    googleReviewId: reviewData.id
                });

                if (existingReview) {
                    // Update existing review
                    await GoogleReview.updateOne(
                        { googleReviewId: reviewData.id },
                        {
                            $set: {
                                authorName: reviewData.authorName,
                                authorUrl: reviewData.authorUrl,
                                profilePhotoUrl: reviewData.profilePhotoUrl,
                                rating: reviewData.rating,
                                text: reviewData.text,
                                time: reviewData.time,
                                relativeTimeDescription: reviewData.relativeTimeDescription,
                                language: reviewData.language,
                                originalData: reviewData.originalData,
                                lastUpdated: new Date()
                            }
                        }
                    );
                    updatedCount++;
                } else {
                    // Create new review
                    const newReview = new GoogleReview({
                        googleReviewId: reviewData.id,
                        authorName: reviewData.authorName,
                        authorUrl: reviewData.authorUrl,
                        profilePhotoUrl: reviewData.profilePhotoUrl,
                        rating: reviewData.rating,
                        text: reviewData.text,
                        time: reviewData.time,
                        relativeTimeDescription: reviewData.relativeTimeDescription,
                        language: reviewData.language,
                        originalData: reviewData.originalData
                    });
                    
                    await newReview.save();
                    syncedCount++;
                }
            } catch (error) {
                console.error(`Error processing review ${reviewData.id}:`, error);
                errorCount++;
            }
        }

        res.json({
            success: true,
            message: 'Google reviews synced successfully',
            syncedCount,
            updatedCount,
            errorCount,
            totalProcessed: googleReviews.length
        });

    } catch (error) {
        console.error('Error syncing Google reviews:', error);
        res.json({
            success: false,
            message: 'Error syncing Google reviews',
            error: error.message
        });
    }
};

/**
 * Get all Google reviews
 */
export const getGoogleReviews = async (req, res) => {
    try {
        const { 
            limit = 50, 
            offset = 0, 
            minRating = 1, 
            maxRating = 5,
            sortBy = 'time',
            sortOrder = 'desc'
        } = req.query;

        const query = {
            isActive: true,
            rating: { $gte: parseInt(minRating), $lte: parseInt(maxRating) }
        };

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const reviews = await GoogleReview.find(query)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(parseInt(offset));

        const totalCount = await GoogleReview.countDocuments(query);

        // Get average rating
        const avgRatingResult = await GoogleReview.getAverageRating();
        const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating : 0;

        res.json({
            success: true,
            message: 'Google reviews fetched successfully',
            reviews,
            totalCount,
            averageRating: Math.round(averageRating * 10) / 10,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        });

    } catch (error) {
        console.error('Error fetching Google reviews:', error);
        res.json({
            success: false,
            message: 'Error fetching Google reviews',
            error: error.message
        });
    }
};

/**
 * Get Google reviews statistics
 */
export const getGoogleReviewsStats = async (req, res) => {
    try {
        const stats = await GoogleReview.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    ratingDistribution: {
                        $push: {
                            rating: '$rating'
                        }
                    }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.json({
                success: true,
                message: 'No Google reviews found',
                stats: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                }
            });
        }

        const result = stats[0];
        
        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        result.ratingDistribution.forEach(item => {
            distribution[item.rating]++;
        });

        res.json({
            success: true,
            message: 'Google reviews statistics fetched successfully',
            stats: {
                totalReviews: result.totalReviews,
                averageRating: Math.round(result.averageRating * 10) / 10,
                ratingDistribution: distribution
            }
        });

    } catch (error) {
        console.error('Error fetching Google reviews statistics:', error);
        res.json({
            success: false,
            message: 'Error fetching Google reviews statistics',
            error: error.message
        });
    }
};

/**
 * Get combined reviews (Google + regular reviews)
 */
export const getCombinedReviews = async (req, res) => {
    try {
        const { productId, limit = 20, offset = 0 } = req.query;

        // Import regular review model
        const Review = (await import('../models/reviewModel.js')).default;

        let regularReviews = [];
        if (productId) {
            regularReviews = await Review.find({ productId })
                .sort({ date: -1 })
                .limit(parseInt(limit))
                .skip(parseInt(offset));
        }

        // Get Google reviews
        const googleReviews = await GoogleReview.find({ isActive: true })
            .sort({ time: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset));

        // Transform reviews to common format
        const transformedRegularReviews = regularReviews.map(review => ({
            id: review._id,
            source: 'internal',
            authorName: review.usersName,
            rating: review.rating,
            text: review.reviewDesc,
            subject: review.reviewSub,
            date: review.date,
            time: Math.floor(review.date.getTime() / 1000)
        }));

        const transformedGoogleReviews = googleReviews.map(review => ({
            id: review._id,
            source: 'google',
            authorName: review.authorName,
            authorUrl: review.authorUrl,
            profilePhotoUrl: review.profilePhotoUrl,
            rating: review.rating,
            text: review.text,
            date: new Date(review.time * 1000),
            time: review.time,
            relativeTimeDescription: review.relativeTimeDescription
        }));

        // Combine and sort by date
        const combinedReviews = [...transformedRegularReviews, ...transformedGoogleReviews]
            .sort((a, b) => b.time - a.time)
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            message: 'Combined reviews fetched successfully',
            reviews: combinedReviews,
            totalCount: combinedReviews.length
        });

    } catch (error) {
        console.error('Error fetching combined reviews:', error);
        res.json({
            success: false,
            message: 'Error fetching combined reviews',
            error: error.message
        });
    }
};
