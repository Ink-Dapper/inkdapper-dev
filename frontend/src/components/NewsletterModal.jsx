import React, { useState, useEffect, useRef, memo, useCallback, useContext } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle } from 'react-icons/fa';
import { assets } from '../assets/assets';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

// Memoize the social media icons component
const SocialIcons = memo(() => (
  <div className="flex justify-center gap-4 mt-6">
    <a href="#" className="text-gray-600 hover:text-orange-600"><FaFacebookF /></a>
    <a href="#" className="text-gray-600 hover:text-orange-600"><FaTwitter /></a>
    <a href="#" className="text-gray-600 hover:text-orange-600"><FaInstagram /></a>
    <a href="#" className="text-gray-600 hover:text-orange-600"><FaGoogle /></a>
  </div>
));

const NewsletterModal = () => {
  const { token, usersDetails } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('hasSeenNewsletterModal');
    if (!hasSeenModal) {
      const showTimer = setTimeout(() => {
        setIsOpen(true);
      }, 6000);
      return () => clearTimeout(showTimer);
    }
  }, []);

  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (token && usersDetails && usersDetails.length > 0) {
      const user = usersDetails[0];
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone ? user.phone.toString() : ''
      }));
    }
  }, [token, usersDetails]);

  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('hasSeenNewsletterModal', 'true');
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleInterestChange = useCallback((interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/newsletter/subscribe', formData);
      toast.success('Thank you for subscribing!');
      handleClose();
      setFormData({
        name: '',
        email: '',
        phone: '',
        interests: []
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [formData, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-4xl w-full flex relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="hidden md:block w-1/2 bg-gray-300 rounded-l-lg overflow-hidden">
          <div className="w-full h-full min-h-[400px] relative">
            <img
              src={assets.banner_one}
              alt="Ink Dapper Collection"
              className="w-full h-full object-cover absolute inset-0"
              loading="eager"
              width="600"
              height="400"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                aspectRatio: '3/2'
              }}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 relative">
              <img
                src={assets.inkdapper_logo}
                alt="Ink Dapper Logo"
                className="w-full h-full object-contain"
                loading="eager"
                width="48"
                height="48"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Ink Dapper</h2>
          </div>
          <h3 className="text-orange-600 text-sm font-semibold mb-2 uppercase text-center">EXCLUSIVE OFFERS</h3>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">Join Our Style Community</h2>
          <p className="text-gray-600 mb-6 text-sm text-center">Subscribe to get exclusive updates on new collections, special offers, and style inspiration for your custom t-shirts and apparel.</p>

          <form
            id="newsletter-form"
            name="newsletter-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {token && usersDetails && usersDetails.length > 0 ? (
              // Show user info for logged-in users
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
                <p className="text-sm text-orange-700 mb-2">
                  <strong>Subscribing as:</strong> {usersDetails[0].name} ({usersDetails[0].email})
                </p>
                <p className="text-xs text-orange-600">
                  Your account information will be used for the newsletter subscription.
                </p>
              </div>
            ) : (
              // Show form fields for anonymous users
              <>
                <input
                  type="text"
                  id="newsletter-name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  autoComplete="name"
                />
                <input
                  type="email"
                  id="newsletter-email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  autoComplete="email"
                />
                <input
                  type="tel"
                  id="newsletter-phone"
                  name="phone"
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoComplete="tel"
                />
              </>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {['T-Shirts', 'Hoodies', 'Sweatshirts', 'Custom Designs'].map((interest) => (
                <label key={interest} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    id={`newsletter-interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                    name={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    autoComplete="off"
                  />
                  {interest}
                </label>
              ))}
            </div>

            <button
              type="submit"
              id="newsletter-submit"
              name="newsletter-submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'SUBSCRIBE NOW'}
            </button>
          </form>

          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default memo(NewsletterModal); 