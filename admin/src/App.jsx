import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompeleteDelivery from './pages/CompeleteDelivery'
import ReturnOrders from './pages/ReturnOrders'
import ReturnOrderCompleted from './pages/ReturnOrderCompleted'
import BannerImages from './pages/BannerImages'
import UserList from './pages/UserList'
import CancelOrders from './pages/CancelOrders'
import CancelOrderCompleted from './pages/CancelOrderCompleted'
import BannerList from './pages/BannerList'
import NewsletterSubscribers from './pages/NewsletterSubscribers'
import Coupons from './pages/Coupons'
import HighlightedProducts from './pages/HighlightedProducts'
import AcidWashProducts from './pages/AcidWashProducts'
import StorageManager from './pages/StorageManager'
import { NotificationProvider } from './context/NotificationContext';

export const backendUrl = import.meta.env.DEV ? '' : (import.meta.env.VITE_BACKEND_URL || 'https://api.inkdapper.com')
export const currency = <span className='font-semibold'>₹</span>

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  // Close sidebar on route change (mobile)
  const handleSidebarClose = () => setSidebarOpen(false)

  return (
    <NotificationProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastClassName="!rounded-xl !font-medium !text-sm !shadow-lg"
      />

      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {/* Sidebar */}
          <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

          {/* Main content column */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Sticky Navbar */}
            <Navbar
              setToken={setToken}
              onMenuClick={() => setSidebarOpen(true)}
            />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="p-4 lg:p-6 min-h-full">
                <Routes>
                  <Route path="/"                        element={<Dashboard token={token} />} />
                  <Route path="/add"                     element={<Add token={token} />} />
                  <Route path="/list"                    element={<List token={token} />} />
                  <Route path="/orders"                  element={<Orders token={token} />} />
                  <Route path="/complete-delivery"       element={<CompeleteDelivery token={token} />} />
                  <Route path="/return-orders"           element={<ReturnOrders token={token} />} />
                  <Route path="/return-orders-complete"  element={<ReturnOrderCompleted token={token} />} />
                  <Route path="/add-banner"              element={<BannerImages token={token} />} />
                  <Route path="/user-list"               element={<UserList token={token} />} />
                  <Route path="/cancel-orders"           element={<CancelOrders token={token} />} />
                  <Route path="/cancel-order-completed"  element={<CancelOrderCompleted token={token} />} />
                  <Route path="/banner-list"             element={<BannerList token={token} />} />
                  <Route path="/banner-images"           element={<BannerImages token={token} />} />
                  <Route path="/newsletter-subscribers"  element={<NewsletterSubscribers token={token} />} />
                  <Route path="/highlighted-products"    element={<HighlightedProducts token={token} />} />
                  <Route path="/acid-wash-products"      element={<AcidWashProducts token={token} />} />
                  <Route path="/coupons"                 element={<Coupons token={token} />} />
                  <Route path="/storage"                 element={<StorageManager token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </NotificationProvider>
  )
}

export default App
