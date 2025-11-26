import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const ProductItem = ({ id, image, name, price, beforePrice, subCategory, soldout, slug, comboPrices }) => {
  // Fallback: generate slug from name if slug is missing
  let safeSlug = slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '');
  // Remove trailing dash if present
  if (safeSlug.endsWith('-')) safeSlug = safeSlug.slice(0, -1);
  const { currency, scrollToTop, addToWishlist, updateWishlistQuantity, token, wishlist, addToCartCombo } = useContext(ShopContext);

  // Calculate offer percentage
  const calculateOfferPercentage = () => {
    if (beforePrice && price && beforePrice > price) {
      const discount = beforePrice - price;
      const percentage = Math.round((discount / beforePrice) * 100);
      return percentage;
    }
    return 0;
  };

  const offerPercentage = calculateOfferPercentage();
  const [favWishlist, setFavWishlist] = useState([]);
  const [changeText, setChangeText] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);

  const handleWishlistToggle = () => {
    if (!token) {
      toast.error('Please login to manage wishlist', { autoClose: 1000, });
    } else {
      // Check if item is already in wishlist
      if (favWishlist.includes(id)) {
        // Remove from wishlist
        updateWishlistQuantity(id, 0);
      } else {
        // Add to wishlist
        addToWishlist(id);
      }
    }
  };

  const funcFavWishlist = () => {
    const obj = wishlist;
    const keys = Object.keys(obj);
    setFavWishlist(keys);
  };

  const createNew = () => {
    const subCategoryMap = {
      'Customtshirt': 'Custom T-shirt',
      'Oversizedtshirt': 'Oversized T-shirt',
      'Solidoversized': 'Solid Oversized T-shirt',
      'Quotesdesigns': 'Quotes Designs',
      'Plaintshirt': 'Plain T-shirt',
      'Acidwash': 'Acid Wash',
      'Polotshirt': 'Polo T-shirt',
      'Hoddies': 'Hoodies',
      'Sweattshirts': 'Sweat T-shirt'
    };

    const newText = subCategoryMap[subCategory];
    if (newText) {
      setChangeText(newText);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const shareOnWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${safeSlug}`;
    const firstImage = image && image.length > 0 ? image[0] : '';
    const shareText = `Check out this amazing product: ${name} - ${currency} ${price}\n${productUrl}${firstImage ? `\n${firstImage}` : ''}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
    toast.success('Opening WhatsApp sharing...', { autoClose: 1500 });
  };

  const shareOnInstagram = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${safeSlug}`;
    const firstImage = image && image.length > 0 ? image[0] : '';
    const textToCopy = firstImage ? `${productUrl}\n${firstImage}` : productUrl;
    navigator.clipboard.writeText(textToCopy);

    toast.info('Link copied! Open Instagram and paste in your story or message', { autoClose: 3000 });
    setShowShareMenu(false);
  };

  const shareViaMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${safeSlug}`;
    const firstImage = image && image.length > 0 ? image[0] : '';
    const shareText = `Check out this amazing product: ${name} - ${currency} ${price}\n${productUrl}${firstImage ? `\n${firstImage}` : ''}`;

    if (navigator.share) {
      navigator.share({
        title: name,
        text: shareText,
        url: productUrl,
      })
        .then(() => setShowShareMenu(false))
        .catch((error) => {
          console.error('Error sharing:', error);
          navigator.clipboard.writeText(shareText);
          toast.info('Link copied to clipboard!', { autoClose: 1500 });
          setShowShareMenu(false);
        });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.info('Link copied to clipboard!', { autoClose: 1500 });
      setShowShareMenu(false);
    }
  };

  useEffect(() => {
    funcFavWishlist();
    createNew();
  }, [wishlist]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showShareMenu]);

  return (
    <div
      className='relative group'
    >
      {/* Enhanced Wishlist Button */}
      {favWishlist.includes(id) ?
        <FavoriteIcon
          onClick={handleWishlistToggle}
          className={`absolute right-4 top-4 z-30 !w-9 !h-9 flex items-center justify-center cursor-pointer text-red-500 hover:text-red-600 transition-all duration-300 transform hover:scale-110 drop-shadow-lg glass-button rounded-full p-1.5`}
        /> :
        <FavoriteBorderIcon
          onClick={handleWishlistToggle}
          className={`absolute right-4 top-4 z-30 !w-9 !h-9 flex items-center justify-center cursor-pointer text-slate-600 hover:text-red-500 transition-all duration-300 transform hover:scale-110 drop-shadow-lg glass-button rounded-full p-1.5`}
        />
      }{/* Enhanced Share Button - visible on all screen sizes */}
      <div className="absolute right-4 top-16 sm:top-16 z-20">
        <button
          onClick={(e) => handleShare(e)}
          className="share-button hover:text-slate-800 transition-all duration-300 transform hover:scale-110 glass-button rounded-full p-1.5 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg"
        >
          <ShareIcon className="text-slate-600 group-hover:text-slate-800 drop-shadow-lg" fontSize="small" />
        </button>

        {/* Enhanced Share Menu */}
        {showShareMenu && (
          <div
            ref={shareMenuRef}
            className="absolute -left-2 sm:-left-6 top-12 glass-card rounded-2xl shadow-2xl p-2 sm:p-3 z-30 min-w-auto"
          >
            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                onClick={(e) => shareOnWhatsApp(e)}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-slate-50 rounded-xl w-full transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#555">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.68-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>

              <button
                onClick={(e) => shareOnInstagram(e)}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-slate-50 rounded-xl w-full transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F9CE34" />
                    <stop offset="25%" stopColor="#EE2A7B" />
                    <stop offset="50%" stopColor="#6228D7" />
                  </linearGradient>
                  <path fill="#555" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>

              <button
                onClick={(e) => shareViaMessage(e)}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-slate-50 rounded-xl w-full transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#555">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <Link
        onClick={() => {
          if (scrollToTop) {
            scrollToTop();
          }
        }}
        className={`text-slate-700 cursor-pointer ${soldout ? 'pointer-events-none' : ''}`}
        to={`/product/${safeSlug}`}
      >
        <div className='glass-product-card transition-all duration-500 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:bright-shadow-multi rounded-2xl md:rounded-3xl overflow-hidden'>
          <div className="overflow-hidden h-72 sm:h-80 bg-gradient-to-br from-slate-50 via-white to-slate-50 flex justify-center items-center relative product-image">
            <div className="w-full h-full relative" style={{ aspectRatio: '3/4' }}>
              <img
                src={image[0]}
                alt={name}
                className={`transition-all duration-700 ease-in-out h-full w-full object-cover relative z-10 group-hover:scale-110 ${soldout ? 'opacity-50' : ''}`}
                loading="lazy"
                decoding="async"
                width="300"
                height="400"
                style={{
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />

              {soldout && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                  <span className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-4 text-xl font-bold rounded-2xl shadow-2xl border border-white/20">
                    SOLD OUT
                  </span>
                </div>
              )}

              {/* Enhanced Logo */}
              <div className='logo absolute bottom-4 right-4 z-10'>
                <img
                  src={assets.logo_only}
                  alt="logo"
                  className="!w-9 !h-8 opacity-80 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 drop-shadow-lg"
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>

              {/* Enhanced Quick View Overlay - desktop / tablet only */}
              <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 items-end justify-center pb-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="backdrop-blur-xl bg-white/95 px-6 py-3 rounded-full text-sm font-bold text-slate-800 shadow-2xl border border-white/20 hover:bg-white transition-colors duration-300">
                    Quick View
                  </div>
                </div>
              </div>


              {/* Enhanced Floating Elements - desktop / tablet only */}
              <div className="hidden md:block absolute top-4 left-4 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 animate-pulse"></div>
              <div className="hidden md:block absolute top-6 right-16 w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 animate-pulse animation-delay-2000"></div>
            </div>


          </div>

          {/* Enhanced Product Info Section */}
          <div className='card-info-section'>
            {/* Category Badge */}
            {changeText && (
              <div className="flex justify-start">
                <span className='category-badge text-white font-medium text-sm space-x-1 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-lg border border-slate-600/20'>
                  {changeText}
                </span>
              </div>
            )}

            {/* Product Name */}
            <div className="flex items-start mt-1">
              <h3 className='product-name text-sm md:text-lg font-semibold text-slate-900 group-hover:text-orange-700 transition-colors duration-300 truncate'>
                {name}
              </h3>
            </div>

            {/* Price Section */}
            <div className='price-container'>
              <div className="flex items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  {beforePrice && (
                    <p className='text-sm text-slate-400 font-semibold line-through original-price'>
                      {currency} {beforePrice}
                    </p>
                  )}
                  <p className='text-1xl md:text-2xl font-black price'>
                    {currency} {price}
                  </p>

                  {/* Offer Percentage Badge */}
                  {offerPercentage > 0 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-[2px] rounded-full shadow-lg border border-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        -{offerPercentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Combo Pricing Display */}
              {comboPrices && comboPrices.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Combo Offers</div>
                  <div className="flex flex-wrap gap-2">
                    {comboPrices.slice(0, 2).map((combo, index) => (
                      <div key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg px-3 py-2 text-xs">
                        <div className="font-bold text-yellow-800">{combo.quantity}x</div>
                        <div className="text-yellow-700 font-semibold">{currency} {combo.price}</div>
                        {combo.discount > 0 && (
                          <div className="text-green-600 font-medium">{combo.discount}% OFF</div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCartCombo(id, combo.quantity);
                          }}
                          disabled={soldout}
                          className="mt-1 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white text-xs font-semibold py-1 px-2 rounded transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                          Add {combo.quantity} to Cart
                        </button>
                      </div>
                    ))}
                    {comboPrices.length > 2 && (
                      <div className="bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 rounded-lg px-3 py-2 text-xs">
                        <div className="font-bold text-slate-700">+{comboPrices.length - 2} more</div>
                        <div className="text-slate-600">offers</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span className="hidden md:inline-block w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse"></span>
                Premium Quality
              </span>

              {/* View Details Badge */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;