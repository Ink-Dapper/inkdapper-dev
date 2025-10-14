import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';
import React, { useContext, useEffect, useState, useRef, memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const ProductItem = ({ id, image, name, price, beforePrice, subCategory, soldout, slug, comboPrices }) => {
  // Use the provided id - ensure it's valid
  const productId = id;

  // Validation: only hide if id is explicitly invalid strings
  if (id === 'undefined' || id === 'null' || id === '') {
    console.error('ProductItem: Invalid id prop', { id, name });
    return null;
  }

  // If no id is provided at all, show product but make it non-clickable
  if (!id) {
    console.warn('ProductItem: Missing id prop for product:', { name });
  }

  // Debug log for live site issues
  if (!productId) {
    console.log('ProductItem Debug:', {
      receivedId: id,
      productId,
      name,
      hasValidId: !!productId
    });
  }

  // Fallback: generate slug from name if slug is missing
  let safeSlug = slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '');
  // Remove trailing dash if present
  if (safeSlug.endsWith('-')) safeSlug = safeSlug.slice(0, -1);
  const { currency, scrollToTop, addToWishlist, token, wishlist, addToCartCombo } = useContext(ShopContext);

  // Calculate offer percentage with memoization
  const offerPercentage = useMemo(() => {
    if (beforePrice && price && beforePrice > price) {
      const discount = beforePrice - price;
      const percentage = Math.round((discount / beforePrice) * 100);
      return percentage;
    }
    return 0;
  }, [beforePrice, price]);
  const [favWishlist, setFavWishlist] = useState([]);
  const [changeText, setChangeText] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shareMenuRef = useRef(null);
  const messageChannelRef = useRef(null);

  useEffect(() => {
    // Initialize message channel
    messageChannelRef.current = new MessageChannel();

    // Cleanup function
    return () => {
      if (messageChannelRef.current) {
        messageChannelRef.current.port1.close();
        messageChannelRef.current.port2.close();
      }
    };
  }, []);

  const addToWishlistPage = useCallback(() => {
    if (!token) {
      toast.error('Please login to add product to wishlist', { autoClose: 1000, });
    } else {
      addToWishlist(productId);
    }
  }, [token, addToWishlist, id]);

  const funcFavWishlist = useCallback(() => {
    const obj = wishlist;
    const keys = Object.keys(obj);
    setFavWishlist(keys);
  }, [wishlist]);

  const createNew = useCallback(() => {
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
  }, [subCategory]);

  const handleShare = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  }, [showShareMenu]);

  const shareOnWhatsApp = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      toast.error('Cannot share product without valid ID');
      return;
    }

    const productUrl = `${window.location.origin}/product/${productId}/${safeSlug}`;
    const shareText = `Check out this amazing product: ${name} - ${currency} ${price}\n${productUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
    toast.success('Opening WhatsApp sharing...', { autoClose: 1500 });
  }, [id, safeSlug, name, currency, price]);

  const shareOnInstagram = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      toast.error('Cannot share product without valid ID');
      return;
    }

    const productUrl = `${window.location.origin}/product/${productId}/${safeSlug}`;
    navigator.clipboard.writeText(productUrl);

    toast.info('Link copied! Open Instagram and paste in your story or message', { autoClose: 3000 });
    setShowShareMenu(false);
  }, [id, safeSlug]);

  const shareViaMessage = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) {
      toast.error('Cannot share product without valid ID');
      return;
    }

    const productUrl = `${window.location.origin}/product/${productId}/${safeSlug}`;
    const shareText = `Check out this amazing product: ${name} - ${currency} ${price}\n${productUrl}`;

    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out this amazing product: ${name} - ${currency} ${price}`,
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
  }, [id, safeSlug, name, currency, price]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    funcFavWishlist();
    createNew();
  }, [wishlist, funcFavWishlist, createNew]);

  return (
    <div
      className='relative group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Wishlist Button */}
      {favWishlist.includes(id) ?
        <FavoriteIcon
          onClick={() => addToWishlistPage()}
          className={`absolute right-4 top-4 z-30 !w-9 !h-9 flex items-center justify-center cursor-pointer text-red-500 hover:text-red-600 transition-all duration-300 transform hover:scale-110 drop-shadow-lg bg-white/80 backdrop-blur-sm rounded-full p-1.5`}
        /> :
        <FavoriteBorderIcon
          onClick={() => addToWishlistPage()}
          className={`absolute right-4 top-4 z-30 !w-9 !h-9 flex items-center justify-center cursor-pointer text-slate-600 hover:text-red-500 transition-all duration-300 transform hover:scale-110 drop-shadow-lg bg-white/80 backdrop-blur-sm rounded-full p-1.5`}
        />
      }{/* Enhanced Share Button */}
      <div className="absolute right-4 top-16 sm:top-16 z-20">
        <button
          onClick={(e) => handleShare(e)}
          className="share-button hover:text-slate-800 transition-all duration-300 transform hover:scale-110 bg-white/90 backdrop-blur-sm rounded-full p-1.5 w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center shadow-lg border border-white/20"
        >
          <ShareIcon className="text-slate-600 group-hover:text-slate-800 drop-shadow-lg" fontSize="small" />
        </button>

        {/* Enhanced Share Menu */}
        {showShareMenu && (
          <div
            ref={shareMenuRef}
            className="absolute -left-6 sm:-left-6 top-12 md:top-9 backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl p-3 z-30 border border-white/20"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={(e) => shareOnWhatsApp(e)}
                className="w-10 h-10 flex items-center justify-center bg-green-50 hover:bg-green-100 rounded-full transition-all duration-300 transform hover:scale-110 group"
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5 text-black-600 group-hover:text-green-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.68-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>

              <button
                onClick={(e) => shareOnInstagram(e)}
                className="w-10 h-10 flex items-center justify-center bg-pink-50 hover:bg-pink-100 rounded-full transition-all duration-300 transform hover:scale-110 group"
                title="Share on Instagram"
              >
                <svg className="w-5 h-5 text-black-600 group-hover:text-pink-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>

              <button
                onClick={(e) => shareViaMessage(e)}
                className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-300 transform hover:scale-110 group"
                title="Share via Message"
              >
                <svg className="w-5 h-5 text-black-600 group-hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24">
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
        to={`/product/${id}/${safeSlug}`}
      >
        <div className='transition-all duration-500 shadow-lg shadow-slate-200/30 hover:shadow-2xl hover:bright-shadow-multi rounded-2xl overflow-hidden bg-white border border-slate-100/50'>
          <div className="overflow-hidden h-72 sm:h-80 bg-gradient-to-br from-slate-50 via-white to-slate-50 flex justify-center items-center relative product-image">
            <div className="w-full h-full relative" style={{ aspectRatio: '3/4' }}>
              <img
                src={image[0]}
                alt={name}
                className={`transition-all duration-500 ease-in-out h-full w-full object-cover relative z-10 group-hover:scale-105 ${soldout ? 'opacity-50' : ''}`}
                loading="lazy"
                decoding="async"
                width="300"
                height="400"
                style={{
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onLoad={(e) => {
                  e.target.style.opacity = '1';
                }}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg'; // Fallback image
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
                  className="!w-8 !h-7 opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 drop-shadow-lg"
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>

              {/* Simplified Quick View Overlay for mobile performance */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <div className="bg-white/90 px-4 py-2 rounded-lg text-xs font-semibold text-slate-800 shadow-lg border border-white/20">
                    Quick View
                  </div>
                </div>
              </div>

              {/* Simplified Floating Elements for mobile performance */}
              <div className="absolute top-3 left-3 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300"></div>
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
              {beforePrice && (
                <p className='text-sm text-slate-400 font-semibold line-through original-price'>
                  {currency} {beforePrice}
                </p>
              )}
              <p className='text-1xl md:text-2xl font-black price'>
                {currency} {price}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 product-item-bottom-section">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-600">Premium Quality</span>
              </div>

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
export default memo(ProductItem);