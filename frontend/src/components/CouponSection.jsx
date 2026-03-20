import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaTag, FaTimes, FaCheck } from 'react-icons/fa';

const CouponSection = () => {
  const {
    currency,
    validateCoupon,
    removeCoupon,
    appliedCoupon,
    couponDiscount,
    getCartAmount
  } = useContext(ShopContext);

  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return;
    }

    setIsLoading(true);
    const success = await validateCoupon(couponCode.trim());
    setIsLoading(false);

    if (success) {
      setCouponCode('');
      setShowCouponInput(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  const cartAmount = getCartAmount();

  if (cartAmount === 0) {
    return null; // Don't show coupon section if cart is empty
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FaTag className="w-5 h-5 text-orange-500" />
          Apply Coupon
        </h3>
        {!appliedCoupon && (
          <button
<<<<<<< HEAD
=======
            type="button"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
            onClick={() => setShowCouponInput(!showCouponInput)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
          >
            {showCouponInput ? 'Cancel' : 'Have a code?'}
          </button>
        )}
      </div>

      {appliedCoupon ? (
        // Applied coupon display
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FaCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800">
                  {appliedCoupon.code}
                </p>
                <p className="text-sm text-green-600">
                  {appliedCoupon.discountType === 'percentage'
                    ? `${appliedCoupon.discountValue}% off`
                    : `${currency}${appliedCoupon.discountValue} off`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-800">
                -{currency}{appliedCoupon.discountAmount}
              </p>
              <button
<<<<<<< HEAD
=======
                type="button"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : showCouponInput ? (
        // Coupon input form
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
<<<<<<< HEAD
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              maxLength={20}
            />
            <button
=======
              className="flex-1 text-slate-400 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              maxLength={20}
            />
            <button
              type="button"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
              onClick={handleApplyCoupon}
              disabled={isLoading || !couponCode.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Enter your coupon code to get instant discounts on your order
          </p>
        </div>
      ) : (
        // Default state - show savings potential
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Save more with coupon codes
          </p>
          <button
<<<<<<< HEAD
=======
            type="button"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
            onClick={() => setShowCouponInput(true)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
          >
            Enter coupon code
          </button>
        </div>
      )}

      {/* Sample coupon suggestions */}
      {!appliedCoupon && !showCouponInput && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Popular offers:</p>
          <div className="flex flex-wrap gap-2">
            {['SAVE10', 'WELCOME20', 'FIRST50'].map((code) => (
              <button
                key={code}
<<<<<<< HEAD
=======
                type="button"
>>>>>>> aa57bc266bf4c9c05d27c80eef28e1705b24958a
                onClick={() => {
                  setCouponCode(code);
                  setShowCouponInput(true);
                }}
                className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-md hover:bg-orange-200 transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponSection;

