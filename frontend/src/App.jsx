import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Lazy load pages
const Collection = lazy(() => import('./pages/Collection'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'))
const Orders = lazy(() => import('./pages/Orders'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const ReviewViewMore = lazy(() => import('./components/ListReviews'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Custom = lazy(() => import('./pages/Custom'))
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'))
const CancellationAndRefund = lazy(() => import('./pages/CancellationAndRefund'))
const ShippingAndDelivery = lazy(() => import('./pages/ShippingAndDelivery'))

const App = () => {
  return (
    <div className='px-3 sm:px-[4vw] md:px-[5vw] lg:px-[7vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/order-details/:productId" element={<OrderDetails />} />
          <Route path="/review-page" element={<ReviewViewMore />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/cancellation-and-refund" element={<CancellationAndRefund />} />
          <Route path="/shipping-and-delivery" element={<ShippingAndDelivery />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}

export default App