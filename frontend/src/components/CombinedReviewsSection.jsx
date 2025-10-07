import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaGoogle, FaStar, FaSync, FaUser } from 'react-icons/fa';

const CombinedReviewsSection = ({ productId = null, showSyncButton = false }) => {
  const {
    reviewList,
    googleReviews,
    combinedReviews,
    fetchReviewList,
    fetchGoogleReviews,
    fetchCombinedReviews,
    syncGoogleReviews
  } = useContext(ShopContext);

  const [isLoading, setIsLoading] = useState(false);
  const [displayReviews, setDisplayReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'internal', 'google'

  useEffect(() => {
    if (productId) {
      fetchCombinedReviews(productId);
    } else {
      fetchReviewList();
      fetchGoogleReviews();
    }
  }, [productId]);

  useEffect(() => {
    if (productId && combinedReviews.length > 0) {
      setDisplayReviews(combinedReviews);
    } else {
      // Filter reviews by productId if provided, otherwise show all reviews
      const filteredReviewList = productId
        ? reviewList.filter(review => review.productId === productId)
        : reviewList;

      const filteredGoogleReviews = productId
        ? googleReviews.filter(review => review.productId === productId)
        : googleReviews;

      // Combine regular and Google reviews manually
      const combined = [
        ...filteredReviewList.map(review => ({
          ...review,
          source: 'internal',
          id: review._id,
          authorName: review.usersName,
          text: review.reviewDesc,
          subject: review.reviewSub,
          time: Math.floor(new Date(review.date).getTime() / 1000),
          date: review.date
        })),
        ...filteredGoogleReviews.map(review => ({
          ...review,
          source: 'google',
          id: review._id
        }))
      ].sort((a, b) => b.time - a.time);

      setDisplayReviews(combined);
    }
  }, [reviewList, googleReviews, combinedReviews, productId]);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncGoogleReviews();
      if (productId) {
        await fetchCombinedReviews(productId);
      } else {
        await fetchReviewList();
        await fetchGoogleReviews();
      }
    } catch (error) {
      console.error('Error syncing reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = displayReviews.filter(review => {
    if (activeTab === 'all') return true;
    if (activeTab === 'internal') return review.source === 'internal';
    if (activeTab === 'google') return review.source === 'google';
    return true;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-amber-400 drop-shadow-sm" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const formatDate = (dateOrTimestamp) => {
    let date;
    if (typeof dateOrTimestamp === 'number') {
      date = new Date(dateOrTimestamp * 1000);
    } else {
      date = new Date(dateOrTimestamp);
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTabCounts = () => {
    const internal = displayReviews.filter(r => r.source === 'internal').length;
    const google = displayReviews.filter(r => r.source === 'google').length;
    return { internal, google, total: displayReviews.length };
  };

  const counts = getTabCounts();

  if (displayReviews.length === 0) {
    return (
      <div className="w-full mt-8 md:mt-12">
        <div className="text-center py-8">
          <FaUser className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 mb-4">Reviews will appear here once customers start sharing their experiences.</p>
          {showSyncButton && (
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FaSync className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Syncing...' : 'Sync Google Reviews'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-8 md:mt-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
          <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
            Customer Reviews
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">{counts.total} reviews</span>
          </div>
          {showSyncButton && (
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FaSync className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Syncing...' : 'Sync Google'}
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          All ({counts.total})
        </button>
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'internal'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Website ({counts.internal})
        </button>
        <button
          onClick={() => setActiveTab('google')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'google'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Google ({counts.google})
        </button>
      </div>

      {/* Reviews Container */}
      <div className="relative">
        {/* Glass morphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white/80 to-amber-50/50 rounded-2xl backdrop-blur-sm border border-white/20"></div>

        {/* Main content */}
        <div className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400"></div>

          {/* Reviews scrollable area */}
          <div className="max-h-[400px] overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">
              {filteredReviews.map((review, index) => (
                <div key={review.id || index} className="group relative">
                  {/* Review card */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-white/40 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                    {/* Header with user info and rating */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* User avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${review.source === 'google'
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                          : 'bg-gradient-to-br from-orange-400 to-amber-500'
                          }`}>
                          {review.profilePhotoUrl ? (
                            <img
                              src={review.profilePhotoUrl}
                              alt={review.authorName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-sm">
                              {review.authorName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 text-sm">{review.authorName}</p>
                            {review.source === 'google' && <FaGoogle className="text-blue-600 text-xs" />}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-500 ml-1">({review.rating}/5)</span>
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-xs text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full">
                        {review.relativeTimeDescription || formatDate(review.time || review.date)}
                      </div>
                    </div>

                    {/* Review content */}
                    <div className="space-y-2">
                      {review.subject && (
                        <h3 className="font-semibold text-gray-900 text-base leading-tight">
                          {review.subject}
                        </h3>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.text}
                      </p>
                    </div>

                    {/* Source attribution */}
                    {review.source === 'google' && (
                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FaGoogle className="text-blue-600" />
                          <span>Review from Google</span>
                          {review.authorUrl && (
                            <a
                              href={review.authorUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View Profile
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Decorative bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-200 rounded-full opacity-60 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-amber-200 rounded-full opacity-40 blur-xl"></div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #f59e0b);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #d97706);
        }
      `}</style>
    </div>
  );
};

export default CombinedReviewsSection;
