import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const ProductItem = ({ id, image, name, price, beforePrice, subCategory }) => {
  const { currency, scrollToTop, addToWishlist, token, wishlist } = useContext(ShopContext);
  const [favWishlist, setFavWishlist] = useState([]);
  const [changeText, setChangeText] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);

  const addToWishlistPage = () => {
    if (!token) {
      toast.error('Please login to add product to cart', { autoClose: 1000, });
    } else {
      addToWishlist(id);
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
      'Quotesdesigns': 'Quotes Designs',
      'Plaintshirt': 'Plain T-shirt',
      'Acidwash': 'Acid Wash',
      'Polotshirt': 'Polo T-shirt',
      'Hoddies': 'Hoodies', // Fixed spelling
      'Sweattshirts': 'Sweat T-shirt' // Fixed spelling
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

    const productUrl = `${window.location.origin}/product/${id}`;
    const shareText = `Check out this amazing product: ${name} - ${currency} ${price}\n${productUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
    toast.success('Opening WhatsApp sharing...', { autoClose: 1500 });
  };

  const shareOnInstagram = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Instagram doesn't have a direct sharing API like WhatsApp
    // So we'll copy the link to clipboard and notify the user
    const productUrl = `${window.location.origin}/product/${id}`;
    navigator.clipboard.writeText(productUrl);

    toast.info('Link copied! Open Instagram and paste in your story or message', { autoClose: 3000 });
    setShowShareMenu(false);
  };

  const shareViaMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${id}`;
    const shareText = `Check out this amazing product: ${name} - ${currency} ${price}\n${productUrl}`;

    // On mobile, this will open the native share dialog if supported
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out this amazing product: ${name} - ${currency} ${price}`,
        url: productUrl,
      })
        .then(() => setShowShareMenu(false))
        .catch(() => {
          // Fallback to copying to clipboard
          navigator.clipboard.writeText(shareText);
          toast.info('Link copied to clipboard!', { autoClose: 1500 });
          setShowShareMenu(false);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText);
      toast.info('Link copied to clipboard!', { autoClose: 1500 });
      setShowShareMenu(false);
    }
  };

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
  }, [wishlist]);

  return (
    <div className='relative'>
      {favWishlist.includes(id) ?
        <FavoriteIcon onClick={() => addToWishlistPage()} className={`absolute right-3 top-2 z-20 cursor-pointer`} /> :
        <FavoriteBorderIcon onClick={() => addToWishlistPage()} className={`absolute right-3 top-2 z-20 cursor-pointer`} />
      }

      <Link onClick={() => scrollToTop()} className={`text-gray-700 cursor-pointer`} to={`/product/${id}`}>
        <div className='transition-shadow shadow-lg shadow-gray-400 rounded-b-md'>
          <div className="overflow-hidden h-54 sm:h-80 bg-gray-200 flex justify-center items-center rounded-t-md relative product-image">
            <img src={image[0]} alt={name} className="transition-all ease-in-out h-[100%] object-cover relative z-10" style={{ width: '-webkit-fill-available' }} />

            <div className='logo'>
              <img src={assets.logo_only} alt="logo" className="absolute bottom-3 right-2 w-5 h-[auto] z-10 opacity-70"/>
            </div>

            {/* Share button */}
            <div className="absolute right-3 top-10 z-20">
              <button
                onClick={(e) => handleShare(e)}
                className="hover:text-gray-100"
              >
                <ShareIcon className="text-gray-800" fontSize="small" />
              </button>

              {/* Share menu popup */}
              {showShareMenu && (
                <div
                  ref={shareMenuRef}
                  className="absolute -left-2 top-8 bg-white rounded-md shadow-lg p-1 z-30"
                >
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => shareOnWhatsApp(e)}
                      className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#555">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.68-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => shareOnInstagram(e)}
                      className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded w-full"
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
                      className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#555">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rest of your product item code */}
          <div className='border-l-2 border-l-gray-950 border-t-2 border-t-gray-950 rounded-b-md relative'>
            <p className='pt-1 pb-1 pl-2 pr-1 md:pt-2 md:pb-2 md:pl-3 md:pr-1 text-sm md:text-base font-medium md:font-semibold truncate'>{name}</p>
            {
              changeText &&
              <p className='py-[2px] px-1 mx-0 text-xs text-white truncate -left-[1.5px] z-10 absolute -top-[22px] bg-gray-900'>{changeText}</p>
            }
            <div className='flex items-center pt-2 bg-gray-950 rounded-b-md'>
              {
                beforePrice && <p className='text-sm pl-4 pb-2 text-gray-300 font-medium relative'>
                  <span className='w-11 h-[2px] bg-red-500 absolute top-[10px] -right-2 -rotate-12'></span>{currency} {beforePrice}</p>
              }
              <p className=' text-sm md:text-lg text-white pl-4 pb-2 font-semibold'>{currency} {price}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;