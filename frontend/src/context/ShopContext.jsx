import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../config/api";
import apiInstance from "../utils/axios";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";
import { Flip } from 'react-toastify';

export const ShopContext = createContext(null)

const ShopContextProvider = (props) => {
  const [isContextReady, setIsContextReady] = useState(false);

  const currency = '₹'
  const delivery_fee = 'Free'
  const [paymentMethod, setPaymentMethod] = useState('cod')
  // Use the API configuration
  const backendUrl = apiConfig.baseURL
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  // Initialize cartItems as empty - will be loaded from database
  const [cartItems, setCartItems] = useState({});
  // Initialize wishlist as empty - will be loaded from database
  const [wishlist, setWishlist] = useState({});
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || '';
    } catch (error) {
      console.error('Error loading token from localStorage:', error);
      return '';
    }
  })
  const navigate = useNavigate()
  const [reviewList, setReviewList] = useState([])
  const [usersDetails, setUsersDetails] = useState([])
  const [orderData, setOrderData] = useState([])
  const [orderCount, setOrderCount] = useState(0)
  const [creditPoints, setCreditPoints] = useState(0)
  const [getCustomData, setGetCustomData] = useState({})
  const [getCustomDataCount, setGetCustomDataCount] = useState()
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [highlightedProducts, setHighlightedProducts] = useState([])

  const fetchUsersDetails = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await apiInstance.post('/user/profile', {})
      const newData = response.data;
      if (newData.users) {
        setUsersDetails([newData])

        // Store user information in localStorage for easy access
        const user = newData.users;
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('user_email', user.email);
        if (user.phone) {
          localStorage.setItem('user_phone', user.phone.toString());
        }
      }
    } catch (error) {
      console.error(error)
    }
  };

  // Helper function to update cart and save to localStorage
  const updateCartAndSave = (newCartData) => {
    setCartItems(newCartData);
  };

  // Helper function to update wishlist (database only)
  const updateWishlistAndSave = (newWishlistData) => {
    setWishlist(newWishlistData);
  };

  const addToCart = async (itemId, size) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await apiInstance.post('/cart/add', { itemId, size });
      if (response.data.success) {
        toast.success('Product added to cart successfully');
        // Refresh cart data from database
        await getUserCart(token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error adding to cart:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const addToCartCombo = async (itemId, quantity, size = 'M') => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      // Add multiple items to cart based on combo quantity
      for (let i = 0; i < quantity; i++) {
        const response = await apiInstance.post('/cart/add', { itemId, size });
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }
      }

      toast.success(`${quantity} items added to cart successfully!`);
      // Refresh cart data from database
      await getUserCart(token);
    } catch (error) {
      console.log('Error adding combo to cart:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const customDataArray = Object.values(getCustomData);

  const getCartCount = () => {
    let totalCount = 0
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += Number(cartItems[items][item])
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }

    // Count from getCustomData
    customDataArray.forEach(customItem => {
      if (customItem.quantity > 0) {
        totalCount += Number(customItem.quantity) || 0;
      }
    });

    return totalCount
  }

  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) {
      toast.error('Please login to update cart');
      return;
    }

    try {
      const response = await apiInstance.post('/cart/update', { itemId, size, quantity });
      if (response.data.success) {
        // Refresh cart data from database
        await getUserCart(token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const getCartAmount = () => {
    let totalAmount = 0
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items)
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item]
          }
        } catch (error) {

        }
      }
    }
    customDataArray.forEach(customItem => {
      if (customItem.quantity > 0) {
        totalAmount += Number(customItem.quantity * customItem.price) || 0;
      }
    });
    return totalAmount
  }

  // Check if cart has multiple products (different product IDs) or multiple quantities
  const hasMultipleProducts = () => {
    const productIds = Object.keys(cartItems);
    const customProductCount = customDataArray.length;

    // Check for multiple different products
    const hasMultipleDifferentProducts = (productIds.length + customProductCount) > 1;

    // Check for multiple quantities of any product
    let totalQuantity = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalQuantity += Number(cartItems[items][item]);
        }
      }
    }
    customDataArray.forEach(customItem => {
      if (customItem.quantity > 0) {
        totalQuantity += Number(customItem.quantity) || 0;
      }
    });

    const hasMultipleQuantities = totalQuantity > 1;

    return hasMultipleDifferentProducts || hasMultipleQuantities;
  }

  // Calculate multi-product discount (7% if more than 1 product)
  const getMultiProductDiscount = () => {
    if (hasMultipleProducts()) {
      return Math.round(getCartAmount() * 0.07); // 7% discount
    }
    return 0;
  }

  const getProductsData = async () => {
    try {
      const response = await apiInstance.get('/product/list')
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getUserCart = async (token) => {
    try {
      const response = await apiInstance.post('/cart/get', {})

      if (response.data.success) {
        const backendCart = response.data.cartData;
        updateCartAndSave(backendCart);
      } else {
        console.log('Failed to get cart data:', response.data.message);
      }
    } catch (error) {
      console.log('Error getting cart:', error);
    }
  }


  const addToWishlist = async (itemId) => {
    if (!token) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const response = await apiInstance.post('/wishlist/add', { itemId });
      if (response.data.success) {
        toast.success(`One Item Is Added To Wishlist.`, {
          autoClose: 1000, pauseOnHover: false,
          transition: Flip
        });
        // Refresh wishlist data from database
        await getUserWishlist(token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error adding to wishlist:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getWishlistCount = () => {
    return Object.values(wishlist).filter(qty => qty > 0).length
  }

  const updateWishlistQuantity = async (itemId, quantity = -1) => {
    if (!token) {
      toast.error('Please login to update wishlist');
      return;
    }

    try {
      // Send the quantity to backend (0 for deletion, actual quantity for updates)
      const finalQuantity = quantity <= 0 ? 0 : quantity;
      const response = await apiInstance.post('/wishlist/update', { itemId, quantity: finalQuantity });

      if (response.data.success) {
        // Show appropriate success message
        if (finalQuantity === 0) {
          toast.success('Item removed from wishlist successfully!', {
            autoClose: 1500,
            pauseOnHover: false,
            transition: Flip
          });
        } else {
          toast.success('Wishlist updated successfully!', {
            autoClose: 1500,
            pauseOnHover: false,
            transition: Flip
          });
        }
        // Refresh wishlist data from database
        await getUserWishlist(token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error updating wishlist:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getUserWishlist = async (token) => {
    try {
      const response = await apiInstance.post('/wishlist/get', {})

      if (response.data.success) {
        const backendWishlist = response.data.wishlistData;
        updateWishlistAndSave(backendWishlist);
      } else {
        console.log('Failed to get wishlist data:', response.data.message);
      }
    } catch (error) {
      console.log('Error getting wishlist:', error);
    }
  }

  const fetchReviewList = async () => {
    try {
      const response = await apiInstance.get('/review/get')
      if (response.data.success) {
        setReviewList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const productSearch = () => {
    if (location.pathname === '/collection') {
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }

  const fetchOrderDetails = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await apiInstance.post('/order/user-details', {})
      if (response.data.success) {
        setOrderData(response.data.orders)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const detailsOrderCount = () => {
    const countNum = orderData.reduce((acc, order) => acc + order.items[0].quantity, 0)
    setOrderCount(countNum)
  }

  const getCreditScore = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await apiInstance.post('/user/profile', {});
      if (response.data.success && response.data.users) {
        setCreditPoints(response.data.users.creditPoints || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getUserCustomData = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await apiInstance.post("/cart/get-custom", {});
      if (response.data.success) {
        setGetCustomData(response.data.customData);
      }
      setGetCustomDataCount(Object.keys(getCustomData).length)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const updateCustomQuantity = async (itemId, size, quantity) => {
    if (!token) {
      toast.error('Please login to update cart');
      return;
    }
    try {
      const response = await apiInstance.post('/cart/update-custom', { itemId, size, quantity });
      if (response.data.success) {
        await getUserCustomData(); // Refresh custom items from backend
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const clearSearchBar = () => {
    setShowSearch(false)
    setSearch('')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Coupon functions
  const validateCoupon = async (couponCode) => {
    try {
      if (!token) {
        toast.error('Please login to apply coupon', { autoClose: 2000 });
        return false;
      }

      const orderAmount = getCartAmount();
      const productIds = Object.keys(cartItems);

      const response = await apiInstance.post(
        '/coupon/validate',
        {
          code: couponCode,
          orderAmount,
          productIds
        },
      );

      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        setCouponDiscount(response.data.coupon.discountAmount);
        toast.success(response.data.message, { autoClose: 2000 });
        return true;
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
        return false;
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      console.error('Response data:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Error applying coupon';
      toast.error(errorMessage, { autoClose: 2000 });
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    toast.success('Coupon removed successfully', { autoClose: 2000 });
  };

  const clearCart = () => {
    updateCartAndSave({});
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Recently viewed products functions
  const addToRecentlyViewed = (product) => {
    if (!product || !product._id) return;

    // Immediate update without debouncing to avoid navigation conflicts
    setRecentlyViewed(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(item => item._id !== product._id);
      // Add to beginning and limit to 8 items
      const updated = [product, ...filtered].slice(0, 8);

      // Save to localStorage with error handling
      try {
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recently viewed to localStorage:', error);
      }

      return updated;
    });
  };

  const getRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading recently viewed from localStorage:', error);
    }
    return [];
  };

  const fetchHighlightedProducts = async () => {
    try {
      const response = await apiInstance.get('/highlighted-products');
      if (response.data.success) {
        setHighlightedProducts(response.data.highlightedProducts);
      } else {
        console.error('Failed to fetch highlighted products:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching highlighted products:', error);
    }
  };

  const getFinalAmount = () => {
    const cartAmount = getCartAmount();
    const multiProductDiscount = getMultiProductDiscount();
    return Math.max(0, cartAmount - couponDiscount - multiProductDiscount);
  };

  // Calculate shipping charges based on payment method
  const getShippingCharges = () => {
    if (paymentMethod === 'razorpay') {
      return 0; // Free shipping for online payment
    } else {
      return 49; // ₹49 for COD
    }
  };

  // Get shipping message based on payment method
  const getShippingMessage = () => {
    if (paymentMethod === 'razorpay') {
      return 'Free shipping on online payment!';
    } else {
      return '₹49 shipping charge for Cash on Delivery';
    }
  };

  const scheduleLowPriority = (task, timeout = 1200) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => {
        task();
      }, { timeout });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(task, Math.min(timeout, 1500));
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    const cleanupFns = [];
    const path = window.location.pathname;
    const routeNeedsReviews = path.startsWith('/product/') || path === '/review-page';

    getProductsData();
    getRecentlyViewed();

    cleanupFns.push(scheduleLowPriority(() => {
      fetchHighlightedProducts();
    }, 1500));

    if (routeNeedsReviews) {
      cleanupFns.push(scheduleLowPriority(() => {
        fetchReviewList();
      }, 900));
    }

    const storedToken = localStorage.getItem('token');
    if (!token && storedToken) {
      setToken(storedToken);
    }

    setIsContextReady(true);

    return () => {
      cleanupFns.forEach((cleanup) => cleanup && cleanup());
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    const cleanup = scheduleLowPriority(() => {
      fetchOrderDetails();
      getUserCustomData();
      fetchUsersDetails();
      getUserWishlist(token);
      getUserCart(token);
    }, 700);

    return () => cleanup && cleanup();
  }, [token]);

  useEffect(() => {
    const path = window.location.pathname;
    const routeNeedsReviews = path.startsWith('/product/') || path === '/review-page';
    if (!routeNeedsReviews || reviewList.length > 0) return;

    const cleanup = scheduleLowPriority(() => {
      fetchReviewList();
    }, 800);

    return () => cleanup && cleanup();
  }, [reviewList.length]);

  useEffect(() => {
    detailsOrderCount();
  }, [orderData]);



  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, addToCartCombo, setCartItems, getCartCount,
    updateQuantity, getCartAmount, clearCart, updateCartAndSave,
    navigate, backendUrl, setToken, token, wishlist,
    addToWishlist, getWishlistCount, updateWishlistQuantity,
    setWishlist, updateWishlistAndSave, reviewList, fetchReviewList, usersDetails,
    scrollToTop, productSearch, clearSearchBar, orderData,
    orderCount, creditPoints, setCreditPoints, getCustomData,
    updateCustomQuantity, customDataArray, getUserCustomData, getCreditScore,
    fetchOrderDetails, validateCoupon, removeCoupon, appliedCoupon,
    couponDiscount, getFinalAmount, hasMultipleProducts, getMultiProductDiscount,
    recentlyViewed, addToRecentlyViewed, getRecentlyViewed,
    highlightedProducts, fetchHighlightedProducts,
    paymentMethod, setPaymentMethod, getShippingCharges, getShippingMessage
  }

  if (!isContextReady) {
    return <SkeletonLoader />;
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
