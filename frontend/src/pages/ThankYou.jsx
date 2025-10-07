import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ThankYou = () => {
  const navigate = useNavigate();
  const { currency } = React.useContext(ShopContext);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [navigate]);

  const handleManualRedirect = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full"></div>
            <div className="absolute top-20 right-16 w-12 h-12 bg-blue-500 rounded-full"></div>
            <div className="absolute bottom-16 left-16 w-16 h-16 bg-purple-500 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-500 rounded-full"></div>
          </div>

          {/* Success Icon */}
          <div className="relative z-10 mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Thank You!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6">
              Your order has been placed successfully
            </p>
            <p className="text-lg text-gray-500 mb-8">
              We've received your order and will process it shortly. You'll receive a confirmation email soon.
            </p>

            {/* Countdown Timer */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <p className="text-gray-600 mb-2">Redirecting to your orders in:</p>
              <div className="text-4xl font-bold text-orange-600 mb-4">
                {countdown}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleManualRedirect}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/collection')}
                className="bg-white border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-orange-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? <span className="text-orange-500 cursor-pointer hover:underline">Contact our support team</span>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 left-10 w-4 h-4 bg-orange-300 rounded-full animate-ping opacity-75"></div>
        <div className="fixed top-40 right-20 w-6 h-6 bg-red-300 rounded-full animate-ping opacity-75 animation-delay-1000"></div>
        <div className="fixed bottom-40 left-20 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75 animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default ThankYou;
