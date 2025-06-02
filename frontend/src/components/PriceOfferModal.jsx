import React, { useState, useEffect, useRef, memo, useCallback } from 'react';

const PriceOfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('hasSeenPriceOfferModal');
    if (!hasSeenModal) {
      const showTimer = setTimeout(() => {
        setIsOpen(true);
        // Set timer to hide modal after 5 seconds
        const hideTimer = setTimeout(() => {
          handleClose();
        }, 5000);

        return () => clearTimeout(hideTimer);
      }, 30000); // Show after 30 seconds

      return () => clearTimeout(showTimer);
    }
  }, []);

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
    localStorage.setItem('hasSeenPriceOfferModal', 'true');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        id="price-offer-modal"
        name="price-offer-modal"
        className="bg-white rounded-lg shadow-xl max-w-md w-full flex relative p-8 text-center flex-col items-center min-h-[300px]"
      >
        <button
          onClick={handleClose}
          id="price-offer-close"
          name="price-offer-close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Special Price Offer!</h2>
          <p className="text-gray-600 mb-6 text-base">Get incredible discounts on selected items for a limited time!</p>

          <div className="flex flex-col gap-4 w-full max-w-[200px]">
            <button
              onClick={handleClose}
              id="price-offer-explore"
              name="explore-offers"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200 w-full"
              autoComplete="off"
            >
              Explore Offers
            </button>

            <button
              onClick={handleClose}
              id="price-offer-dismiss"
              name="dismiss-offer"
              className="text-gray-600 hover:text-gray-800 text-sm w-full"
              autoComplete="off"
            >
              No, thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PriceOfferModal); 