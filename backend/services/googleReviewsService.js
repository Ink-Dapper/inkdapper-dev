import axios from 'axios';

class GoogleReviewsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
    this.placeId = process.env.GOOGLE_PLACE_ID; // Your business place ID
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
  }

  /**
   * Fetch reviews from Google Places API
   * @returns {Promise<Array>} Array of Google reviews
   */
  async fetchGoogleReviews() {
    try {
      if (!this.apiKey || !this.placeId) {
        throw new Error('Google Places API key or Place ID not configured');
      }

      const url = `${this.baseUrl}/details/json?place_id=${this.placeId}&fields=reviews&key=${this.apiKey}`;
      
      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      const reviews = response.data.result.reviews || [];
      
      // Transform Google reviews to match our review format
      return reviews.map(review => ({
        id: `google_${review.time}`,
        source: 'google',
        authorName: review.author_name,
        authorUrl: review.author_url,
        profilePhotoUrl: review.profile_photo_url,
        rating: review.rating,
        text: review.text,
        time: review.time,
        relativeTimeDescription: review.relative_time_description,
        language: review.language,
        originalData: review
      }));
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      throw error;
    }
  }

  /**
   * Get cached reviews or fetch fresh ones
   * @param {boolean} forceRefresh - Force refresh from Google API
   * @returns {Promise<Array>} Array of reviews
   */
  async getReviews(forceRefresh = false) {
    try {
      // In a production environment, you might want to cache this data
      // and refresh it periodically instead of calling Google API every time
      return await this.fetchGoogleReviews();
    } catch (error) {
      console.error('Error getting Google reviews:', error);
      return [];
    }
  }

  /**
   * Filter reviews by rating
   * @param {Array} reviews - Array of reviews
   * @param {number} minRating - Minimum rating to include
   * @returns {Array} Filtered reviews
   */
  filterByRating(reviews, minRating = 1) {
    return reviews.filter(review => review.rating >= minRating);
  }

  /**
   * Sort reviews by date (newest first)
   * @param {Array} reviews - Array of reviews
   * @returns {Array} Sorted reviews
   */
  sortByDate(reviews) {
    return reviews.sort((a, b) => b.time - a.time);
  }

  /**
   * Get average rating from reviews
   * @param {Array} reviews - Array of reviews
   * @returns {number} Average rating
   */
  getAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
  }
}

export default GoogleReviewsService;
