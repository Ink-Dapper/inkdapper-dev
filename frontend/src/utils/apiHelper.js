// API Helper for environment-aware API calls
// This ensures API calls work correctly in both development and production

import axios from '../utils/axios';

// Helper function to make API calls that work in both environments
export const apiCall = {
  // GET request
  get: async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      return response;
    } catch (error) {
      console.error(`API GET Error for ${endpoint}:`, error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data = {}) => {
    try {
      const response = await axios.post(endpoint, data);
      return response;
    } catch (error) {
      console.error(`API POST Error for ${endpoint}:`, error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      const response = await axios.put(endpoint, data);
      return response;
    } catch (error) {
      console.error(`API PUT Error for ${endpoint}:`, error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await axios.delete(endpoint);
      return response;
    } catch (error) {
      console.error(`API DELETE Error for ${endpoint}:`, error);
      throw error;
    }
  }
};

// Specific API endpoints
export const apiEndpoints = {
  // Product endpoints
  getBannerList: () => apiCall.get('/product/banner-list'),
  
  // Order endpoints
  getUserOrders: () => apiCall.post('/order/user-details'),
  placeOrder: (orderData) => apiCall.post('/order/place', orderData),
  placeRazorpayOrder: (orderData) => apiCall.post('/order/razorpay', orderData),
  verifyRazorpayPayment: (paymentData) => apiCall.post('/order/verify-razorpay', paymentData),
  updateOrderStatus: (orderData) => apiCall.post('/order/user-orders', orderData),
  clearCredit: () => apiCall.post('/order/credit-clear'),
  
  // User endpoints
  getUserProfile: () => apiCall.post('/user/profile'),
  
  // Cart endpoints
  addToCart: (cartData) => apiCall.post('/cart/add', cartData),
  updateCart: (cartData) => apiCall.post('/cart/update', cartData),
  getCart: () => apiCall.post('/cart/get'),
  addCustomToCart: (customData) => apiCall.post('/cart/custom', customData),
  getCustomCart: () => apiCall.post('/cart/get-custom'),
  
  // Review endpoints
  postReview: (reviewData) => apiCall.post('/review/post', reviewData),
  getReviews: () => apiCall.get('/review/get'),
  
  // Wishlist endpoints
  addToWishlist: (wishlistData) => apiCall.post('/wishlist/add', wishlistData),
  getWishlist: () => apiCall.post('/wishlist/get'),
  
  // Google Reviews endpoints - Commented out
  /*
  getGoogleReviews: () => apiCall.get('/google-reviews/get'),
  getCombinedReviews: (productId = null) => {
    const endpoint = productId ? `/google-reviews/combined?productId=${productId}` : '/google-reviews/combined';
    return apiCall.get(endpoint);
  },
  syncGoogleReviews: () => apiCall.post('/google-reviews/sync')
  */
};

export default apiEndpoints;
