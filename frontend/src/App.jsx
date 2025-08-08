import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import SkeletonLoader from './components/SkeletonLoader';
import NotFound from './pages/NotFound';

// Lazy load modals
const NewsletterModal = lazy(() => import('./components/NewsletterModal'));
const PriceOfferModal = lazy(() => import('./components/PriceOfferModal'));

// Lazy load pages with dynamic imports and prefetching
const Collection = lazy(() => import(/* webpackChunkName: "collection" */ './pages/Collection'));
const Product = lazy(() => import(/* webpackChunkName: "product" */ './pages/Product'));
const Cart = lazy(() => import(/* webpackChunkName: "cart" */ './pages/Cart'));
const PlaceOrder = lazy(() => import(/* webpackChunkName: "place-order" */ './pages/PlaceOrder'));
const Orders = lazy(() => import(/* webpackChunkName: "orders" */ './pages/Orders'));
const About = lazy(() => import(/* webpackChunkName: "about" */ './pages/About'));
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ './pages/Contact'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home'));
const Login = lazy(() => import(/* webpackChunkName: "login" */ './pages/Login'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './pages/Profile'));
const OrderDetails = lazy(() => import(/* webpackChunkName: "order-details" */ './pages/OrderDetails'));
const Wishlist = lazy(() => import(/* webpackChunkName: "wishlist" */ './pages/Wishlist'));
const ReviewViewMore = lazy(() => import(/* webpackChunkName: "reviews" */ './components/ListReviews'));
const PrivacyPolicy = lazy(() => import(/* webpackChunkName: "privacy" */ './pages/PrivacyPolicy'));
const Custom = lazy(() => import(/* webpackChunkName: "custom" */ './pages/Custom'));
const TermsAndConditions = lazy(() => import(/* webpackChunkName: "terms" */ './pages/TermsAndConditions'));
const CancellationAndRefund = lazy(() => import(/* webpackChunkName: "cancellation" */ './pages/CancellationAndRefund'));
const ShippingAndDelivery = lazy(() => import(/* webpackChunkName: "shipping" */ './pages/ShippingAndDelivery'));

// Prefetch routes on hover
const prefetchRoute = (importFn) => {
  const prefetch = () => {
    importFn();
  };
  return prefetch;
};

const App = () => {
  return (
    <div className="app-container">
      {/* Global Background */}
      <div className="global-background">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-red-50/20 to-yellow-50/20"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-3000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-gradient-to-r from-red-200/25 to-orange-200/25 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-3 sm:px-[4vw] md:px-[5vw] lg:px-[7vw]">
        <ToastContainer />
        <Navbar />
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId/:slug" element={<Product />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
        <Suspense fallback={null}>
          <NewsletterModal />
          <PriceOfferModal />
        </Suspense>
      </div>
    </div>
  );
};

export default App;