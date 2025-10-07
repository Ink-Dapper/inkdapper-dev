import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaGoogle, FaSync, FaChartBar, FaStar } from 'react-icons/fa';

const GoogleReviewsAdmin = () => {
  const {
    googleReviews,
    fetchGoogleReviews,
    syncGoogleReviews
  } = useContext(ShopContext);

  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncGoogleReviews();
      await fetchGoogleReviews();
    } catch (error) {
      console.error('Error syncing reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    if (googleReviews.length === 0) return null;

    const totalReviews = googleReviews.length;
    const averageRating = googleReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    googleReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  };

  const currentStats = getStats();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaGoogle className="text-blue-600 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-800">Google Reviews Management</h1>
          </div>
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <FaSync className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Syncing...' : 'Sync Reviews'}
          </button>
        </div>

        {/* Statistics */}
        {currentStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaChartBar className="text-blue-600" />
                <span className="font-semibold text-gray-700">Total Reviews</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{currentStats.totalReviews}</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaStar className="text-green-600" />
                <span className="font-semibold text-gray-700">Average Rating</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{currentStats.averageRating}/5</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaStar className="text-orange-600" />
                <span className="font-semibold text-gray-700">5-Star Reviews</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{currentStats.ratingDistribution[5]}</div>
            </div>
          </div>
        )}

        {/* Rating Distribution */}
        {currentStats && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium text-gray-600">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(currentStats.ratingDistribution[rating] / currentStats.totalReviews) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm font-medium text-gray-600">
                    {currentStats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-700">Recent Google Reviews</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {googleReviews.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaGoogle className="mx-auto text-4xl text-gray-300 mb-2" />
                <p>No Google reviews found. Click "Sync Reviews" to fetch them.</p>
              </div>
            ) : (
              <div className="divide-y">
                {googleReviews.slice(0, 10).map((review, index) => (
                  <div key={review._id || index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {review.authorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{review.authorName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                size={12}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({review.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.relativeTimeDescription || new Date(review.time * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Setup Required</h4>
          <p className="text-yellow-700 text-sm mb-2">
            To use Google Reviews, you need to configure the following environment variables:
          </p>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• <code>GOOGLE_PLACES_API_KEY</code> - Your Google Places API key</li>
            <li>• <code>GOOGLE_PLACE_ID</code> - Your business Google Place ID</li>
          </ul>
          <p className="text-yellow-700 text-sm mt-2">
            See <code>GOOGLE_REVIEWS_SETUP.md</code> for detailed setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleReviewsAdmin;
