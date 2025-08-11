import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa';
import CompeleteDelivery from './pages/CompeleteDelivery'
import ReturnOrders from './pages/ReturnOrders'
import ReturnOrderCompleted from './pages/ReturnOrderCompleted'
import BannerImages from './pages/BannerImages'
import UserList from './pages/UserList'
import CancelOrders from './pages/CancelOrders'
import CancelOrderCompleted from './pages/CancelOrderCompleted'
import BannerList from './pages/BannerList'
import NewsletterSubscribers from './pages/NewsletterSubscribers'
import { NotificationProvider } from './context/NotificationContext';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = <span className='font-semibold gap-2'>₹</span>
export const cross = <FaTimes />

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <NotificationProvider>
      <div className='bg-gray-50 min-h-screen'>
        <ToastContainer />
        {token === ""
          ? <Login setToken={setToken} />
          : <>
            <Navbar setToken={setToken} />
            <hr />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[78%] mx-auto ml-[max(2vw,20px)] my-1 text-gray-600 text-base  h-[calc(95vh-40px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400'>
                <style>
                  {`
                    .scrollbar-thin::-webkit-scrollbar {
                      width: 6px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                      background: #f1f1f1;
                      border-radius: 10px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                      background: #d1d5db;
                      border-radius: 10px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                      background: #9ca3af;
                    }
                  `}
                </style>
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route path="/" element={<Dashboard token={token} />} />
                  <Route path="/complete-delivery" element={<CompeleteDelivery token={token} />} />
                  <Route path="/return-orders" element={<ReturnOrders token={token} />} />
                  <Route path="/return-orders-complete" element={<ReturnOrderCompleted token={token} />} />
                  <Route path="/add-banner" element={<BannerImages token={token} />} />
                  <Route path="/user-list" element={<UserList token={token} />} />
                  <Route path="/cancel-orders" element={<CancelOrders token={token} />} />
                  <Route path="/cancel-order-completed" element={<CancelOrderCompleted token={token} />} />
                  <Route path="/banner-list" element={<BannerList token={token} />} />
                  <Route path="/banner-images" element={<BannerImages token={token} />} />
                  <Route path="/newsletter-subscribers" element={<NewsletterSubscribers token={token} />} />
                </Routes>
              </div>
            </div>
          </>
        }
      </div>
    </NotificationProvider>
  )
}

export default App