import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Flip } from 'react-toastify';

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

  const currency = '₹'
  const delivery_fee = 1
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState({})
  const [wishlist, setWishlist] = useState({})
  const [products, setProducts] = useState([])
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const [reviewList, setReviewList] = useState([])
  const [usersDetails, setUsersDetails] = useState([])
  const [orderData, setOrderData] = useState([])
  const [orderCount, setOrderCount] = useState(0)
  const [creditPoints, setCreditPoints] = useState(0)
  const [getCustomData, setGetCustomData] = useState({})
  const [getCustomDataCount, setGetCustomDataCount] = useState()

  const fetchUsersDetails = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } })
      const newData = response.data;
      if (newData.users) {
        setUsersDetails([newData])
      }
    } catch (error) {
      console.error(error)
    }
  };

  const addToCart = async (itemId, size) => {
    let cartData = structuredClone(cartItems)
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      } else {
        cartData[itemId][size] = 1
      }
      console.log(cartData[itemId])
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }
    setCartItems(cartData)
    console.log(cartData)

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
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
    let cartData = structuredClone(cartItems)
    if (!cartData[itemId]) {
      cartData[itemId] = {}; // Ensure the item exists
    }
    cartData[itemId][size] = quantity

    setCartItems(cartData)

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
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
      const response = await axios.get(backendUrl + '/api/product/list')
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
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })

      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const addToWishlist = async (itemId) => {
    let wishlistData = structuredClone(wishlist);
    if (!wishlistData[itemId]) {
      wishlistData[itemId] = 1;
      setWishlist(wishlistData);

      if (token) {
        try {
          await axios.post(backendUrl + '/api/wishlist/add', { itemId }, { headers: { token } });
          toast.success(`One Item Is Added To Wishlist.`, {
            autoClose: 1000, pauseOnHover: false,
            transition: Flip
          })
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    } else {
      toast.info(`This item is already in your wishlist.`, {
        autoClose: 1000, pauseOnHover: false,
        transition: Flip
      });
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
    setWishlist((prevWishlist) => {
      if (prevWishlist[itemId] > 0) {
        prevWishlist[itemId] += quantity;
        if (prevWishlist[itemId] <= 0) {
          delete prevWishlist[itemId];
        }
      }
      return { ...prevWishlist };
    });

    if (token) {
      try {
        await axios.post(backendUrl + '/api/wishlist/update', { itemId, quantity }, { headers: { token } })
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const getUserWishlist = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/wishlist/get', {}, { headers: { token } })

      if (response.data.success) {
        setWishlist(response.data.wishlistData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const fetchReviewList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/review/get')
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
      const response = await axios.post(backendUrl + '/api/order/user-details', {}, { headers: { token } })
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
      const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } });
      if (response.data.success) {
        setCreditPoints(response.data.users.creditPoints);
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
      const response = await axios.post(backendUrl + "/api/cart/get-custom", {}, { headers: { token } });
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

    setCartItems(cartData)

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update-custom', { itemId, size, quantity }, { headers: { token } })
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

  useEffect(() => {
    if (token) {
      fetchOrderDetails();
      getUserCustomData();
      fetchUsersDetails();
    }
    getProductsData();
    fetchReviewList();
  }, [token, wishlist]);

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
  }, []);

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, addToCart, setCartItems, getCartCount,
    updateQuantity, getCartAmount,
    navigate, backendUrl, setToken, token, wishlist,
    addToWishlist, getWishlistCount, updateWishlistQuantity,
    setWishlist, reviewList, fetchReviewList, usersDetails,
    scrollToTop, productSearch, clearSearchBar, orderData,
    orderCount, creditPoints, setCreditPoints, getCustomData,
    updateCustomQuantity, customDataArray, getCreditScore,
    fetchOrderDetails
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider
