import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const [orders, setOrders] = useState([])
  const [userList, setUserList] = useState([])
  const [users, setUsers] = useState([]);
  const edit = <FaEdit />
  const trash = <FaTrash />

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId, deliveryDate) => {

    try {
      const response = await axios.post(backendUrl + '/api/order/status', {
        orderId,
        status: event.target.value,
        deliveryDate: Date.now()
      }, { headers: { token } })
      console.log(response.data)
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  const handleReturnConfirmationResponse = async (orderId, userId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/user-orders', {
        returnOrderStatus: 'Return Confirmed',
        orderId: orderId,
        userId: userId
      }, { headers: { token } });
      console.log(response.data);
      if (response.data.success) {
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === orderId ? { ...order, returnOrderStatus: 'Return Confirmed' } : order
        ));
        toast.success('Return Order Confirmed');
        console.log('Return Order Confirmed');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to confirm return order');
    }
  };

  const handleCancelConfirmationResponse = async (orderId, userId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/user-orders', {
        returnOrderStatus: 'Cancel Confirmed',
        orderId: orderId,
        userId: userId
      }, { headers: { token } });
      console.log(response.data);
      if (response.data.success) {
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === orderId ? { ...order, returnOrderStatus: 'Cancel Confirmed' } : order
        ));
        toast.success('Cancel Order Confirmed');
        console.log('Cancel Order Confirmed');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to confirm Cancel order');
    }
  };

  const deductCreditPoints = (userId, points) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, creditPoints: user.creditPoints - points } : user
      )
    );
  };

  const usersList = async () => {
    if (!token) {
      return null
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/users-list', {}, { headers: { token } })
      console.log(response.data)
      if (response.data.success) {
        setUserList(response.data.userList)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllOrders();
    usersList()
  }, [token]);

  const value = {
    token, orders, statusHandler,
    edit, trash, backendUrl,
    handleReturnConfirmationResponse,
    userList, deductCreditPoints,
    handleCancelConfirmationResponse
  }
  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider