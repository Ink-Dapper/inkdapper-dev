import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../config/api";
import apiInstance from "../utils/axios";
import { toast } from "react-toastify";
import { Flip } from 'react-toastify';

export const ShopContext = createContext(null)

const ShopContextProvider = (props) => {
  const [isContextReady, setIsContextReady] = useState(false);

  const currency = '₹'
  const delivery_fee = 'Free'
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

  const getWishlistCount = async () => {
    let totalCount = 0
    for (let items in wishlist) {
      if (wishlist[items] > 0) {
        totalCount += wishlist[items]
      }
    }
    return totalCount
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
    let cartData = structuredClone(cartItems)
    console.log(cartData[itemId])
    if (!cartData[itemId]) {
      cartData[itemId] = {}; // Ensure the item exists
    }
    cartData[itemId][size] = quantity

    updateCartAndSave(cartData)

    if (token) {
      try {
        await apiInstance.post('/cart/update-custom', { itemId, size, quantity })
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const clearSearchBar = () => {
    setShowSearch(false)
    setSearch('')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 10, behavior: 'smooth' });
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

  const getFinalAmount = () => {
    const cartAmount = getCartAmount();
    return Math.max(0, cartAmount - couponDiscount);
  };

  useEffect(() => {
    if (token) {
      fetchOrderDetails();
      getUserCustomData();
      fetchUsersDetails();
      getUserWishlist(token);
      getUserCart(token);
    }
    getProductsData();
    fetchReviewList();
  }, [token]);

  useEffect(() => {
    detailsOrderCount();
  }, [orderData]);

  // useEffect(() => {
  // }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!token && storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
      getUserWishlist(storedToken);
    }
    // Set context as ready after initialization
    setIsContextReady(true);
  }, []);



  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, setCartItems, getCartCount,
    updateQuantity, getCartAmount, clearCart, updateCartAndSave,
    navigate, backendUrl, setToken, token, wishlist,
    addToWishlist, getWishlistCount, updateWishlistQuantity,
    setWishlist, updateWishlistAndSave, reviewList, fetchReviewList, usersDetails,
    scrollToTop, productSearch, clearSearchBar, orderData,
    orderCount, creditPoints, setCreditPoints, getCustomData,
    updateCustomQuantity, customDataArray, getCreditScore,
    fetchOrderDetails, validateCoupon, removeCoupon, appliedCoupon,
    couponDiscount, getFinalAmount
  }

  if (!isContextReady) {
    return <div>Loading...</div>;
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
