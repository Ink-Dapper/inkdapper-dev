import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaStar, FaPaintBrush, FaTshirt, FaRegDotCircle, FaLeaf, FaRegCalendarAlt, FaRegHandPeace, FaHeart, FaShare, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Flip, toast } from "react-toastify";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { assets } from '../assets/assets';
import ListReviews from '../components/ListReviews';
import ProductReviewSection from '../components/ProductReviewSection';
import RelatedProducts from '../components/RelatedProducts';

import { ShopContext } from '../context/ShopContext';
import '../styles/swiper-custom.css';
import { Paintbrush, Shirt, Circle, Leaf, Calendar, Hand, Truck, Shield, RotateCcw, Heart, Share2 } from 'lucide-react';

// Add this hook to detect screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const Product = () => {
  const { productId, slug } = useParams()
  const navigate = useNavigate()
  const context = useContext(ShopContext)

  // Safety check to prevent destructuring undefined context
  if (!context) {
    return <div>Loading...</div>
  }

  const { products, currency, addToCart, addToCartCombo, token, getCartCount, addToWishlist, getWishlistCount, reviewList, scrollToTop, cartItems, updateQuantity, addToRecentlyViewed, wishlist } = context
  const [productData, setProductData] = useState(false)
  const [productNotFound, setProductNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [buyNow, setBuyNow] = useState('block')
  const [wishlistCount, setWishlistCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0)
  const [averageRating, setAverageRating] = useState(0);
  const [changeText, setChangeText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenOne, setIsModalOpenOne] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const shareMenuRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ left: '0', bottom: '12' });
  const [thumbsSwiperInstance, setThumbsSwiperInstance] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCounts = async () => {
      const wishlistCount = await getWishlistCount();
      setWishlistCount(wishlistCount);
    }
    fetchCounts();
  }, [getWishlistCount]);

  // Check if current product is in wishlist
  useEffect(() => {
    if (productData && productData._id) {
      const isInWishlist = wishlist[productData._id] && wishlist[productData._id] > 0;
      setIsWishlisted(isInWishlist);
    }
  }, [productData, wishlist]);



  const fetchProductData = async () => {
    setIsLoading(true);
    setProductNotFound(false);

    // Check if products array is empty (still loading)
    if (products.length === 0) {
      console.log('Products still loading, waiting...');
      setIsLoading(false);
      return;
    }

    // Check if productId is a temporary ID
    if (productId && productId.startsWith('temp-id-')) {
      console.log('Temporary product ID detected, redirecting to collection');
      setProductNotFound(true);
      setIsLoading(false);
      setTimeout(() => {
        navigate('/collection');
      }, 2000);
      return;
    }

    // Look for the product in the products array
    const foundProduct = products.find(item => item._id === productId);

    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
      setIsLoading(false);
    } else {
      // Product not found - could be deleted or invalid ID
      console.log(`Product with ID ${productId} not found in database, redirecting...`);
      setProductNotFound(true);
      setIsLoading(false);
      // Redirect to collection after a short delay
      setTimeout(() => {
        navigate('/collection');
      }, 2000);
    }
  }

  const addCartPageDetails = () => {
    if (!token) {
      toast.error('Please login to add product to cart', { autoClose: 1000, })
    } else if (!size) {
      toast.error('Select Product Size', {
        autoClose: 2000, pauseOnHover: false,
        transition: Flip
      })
    } else {
      // Check if item already exists in cart
      const existingQuantity = cartItems[productData._id]?.[size] || 0;
      const newQuantity = existingQuantity + quantity;

      // Check stock availability
      const maxStock = productData.stock;
      if (maxStock && newQuantity > maxStock) {
        toast.error(`Only ${maxStock} items available in stock`, {
          autoClose: 2000, pauseOnHover: false,
          transition: Flip
        });
        return;
      }

      // Use updateQuantity to set the total quantity
      updateQuantity(productData._id, size, newQuantity);

      const itemText = quantity === 1 ? 'Item' : 'Items';
      toast.success(`${quantity} ${itemText} Added To Cart`, {
        autoClose: 1000, pauseOnHover: false,
        transition: Flip
      })

      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    }
  }

  const buyNowHandler = () => {
    if (!token) {
      toast.error('Please login to proceed with purchase', { autoClose: 1000, })
    } else if (!size) {
      toast.error('Select Product Size', {
        autoClose: 2000, pauseOnHover: false,
        transition: Flip
      })
    } else {
      // Check if item already exists in cart
      const existingQuantity = cartItems[productData._id]?.[size] || 0;
      const newQuantity = existingQuantity + quantity;

      // Check stock availability
      const maxStock = productData.stock;
      if (maxStock && newQuantity > maxStock) {
        toast.error(`Only ${maxStock} items available in stock`, {
          autoClose: 2000, pauseOnHover: false,
          transition: Flip
        });
        return;
      }

      // Use updateQuantity to set the total quantity
      updateQuantity(productData._id, size, newQuantity);

      const itemText = quantity === 1 ? 'Item' : 'Items';
      toast.success(`${quantity} ${itemText} Added To Cart`, {
        autoClose: 1000, pauseOnHover: false,
        transition: Flip
      })

      // Reset quantity to 1 after adding to cart
      setQuantity(1);

      // Navigate to place-order page (like Proceed to Checkout)
      navigate('/place-order');
    }
  }

  const addToWishlistPage = async () => {
    if (!token) {
      toast.error('Please login to add product to wishlist', { autoClose: 1000, })
      return;
    }

    if (isWishlistLoading) {
      return; // Prevent multiple clicks
    }

    try {
      setIsWishlistLoading(true);
      await addToWishlist(productData._id);
      // The isWishlisted state will be updated automatically via the useEffect when wishlist changes
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  }

  const createNew = () => {
    const subCategoryMap = {
      'Customtshirt': 'Custom T-shirt',
      'Oversizedtshirt': 'Oversized T-shirt',
      'Solidoversized': 'Solid Oversized T-shirt',
      'Quotesdesigns': 'Quotes Designs',
      'Plaintshirt': 'Plain T-shirt',
      'Acidwash': 'Acid Wash',
    };

    const newText = subCategoryMap[productData.subCategory];
    if (newText) {
      setChangeText(newText);
    }
  }

  const getProductReviewCount = () => {
    const productReviews = reviewList.filter(item => item.productId === productId);
    const reviewCount = productReviews.length
    setReviewCount(reviewCount)

    const totalRating = productReviews.reduce((acc, items) => {
      const rating = Number(items.rating);
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0);

    const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;
    const getAverageRating = Math.floor(averageRating * 5) / 5
    setAverageRating(getAverageRating);
  }

  const handleShareButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const isNearRightEdge = window.innerWidth - rect.right < 180;

    setPopupPosition({
      left: isNearRightEdge ? 'auto' : '0',
      right: isNearRightEdge ? '0' : 'auto',
      bottom: '12'
    });

    setShowShareMenu(!showShareMenu);
  };

  const shareOnWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${productId}/${productData.slug}`;
    const shareText = `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}\n${productUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
    toast.success('Opening WhatsApp sharing...', { autoClose: 1500 });
  };

  const shareOnInstagram = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${productId}/${productData.slug}`;
    navigator.clipboard.writeText(productUrl);

    toast.info('Link copied! Open Instagram and paste in your story or message', { autoClose: 3000 });
    setShowShareMenu(false);
  };

  const shareViaMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${productId}/${productData.slug}`;
    const shareText = `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}\n${productUrl}`;

    if (navigator.share) {
      navigator.share({
        title: productData.name,
        text: `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}`,
        url: productUrl,
      })
        .then(() => setShowShareMenu(false))
        .catch(() => {
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

  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchProductData()
    getProductReviewCount()
    createNew();
  }, [productId, products])

  // Separate useEffect for other dependencies
  useEffect(() => {
    getProductReviewCount()
  }, [reviewList])

  // Separate useEffect for recently viewed to avoid conflicts
  useEffect(() => {
    if (productData && productData._id === productId) {
      addToRecentlyViewed(productData)
    }
  }, [productData, productId])

  // Initialize arrow opacity when thumbs swiper is ready
  useEffect(() => {
    if (thumbsSwiperInstance) {
      const prevButton = document.querySelector('.swiper-button-prev-thumbs');
      const nextButton = document.querySelector('.swiper-button-next-thumbs');

      if (prevButton) {
        prevButton.style.opacity = thumbsSwiperInstance.isBeginning ? '0.3' : '1';
      }
      if (nextButton) {
        nextButton.style.opacity = thumbsSwiperInstance.isEnd ? '0.3' : '1';
      }
    }
  }, [thumbsSwiperInstance])

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  }

  const openModalOne = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpenOne(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const closeModalOne = () => {
    setIsModalOpenOne(false);
  }

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productData.reviewImage.length);
  }

  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + productData.reviewImage.length) % productData.reviewImage.length);
  }

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show product not found state
  if (productNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            {productId && productId.startsWith('temp-id-') ? (
              <>
                This appears to be a temporary link.
                <span className="block mt-2 text-sm text-orange-600">
                  Redirecting to our collection...
                </span>
              </>
            ) : (
              <>
                The product you're looking for may have been removed or is no longer available.
                <span className="block mt-2 text-sm text-gray-500">
                  Don't worry! We have many other great products for you.
                </span>
              </>
            )}
          </p>
          <div className="space-y-3">
            <Link
              to="/collection"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Browse Collection
            </Link>
            <div className="text-sm text-gray-500">
              Redirecting automatically in 2 seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return productData ? (
    <div className='min-h-screen'>
      {/* Breadcrumb */}
      <div className='py-3 px-4 md:px-8'>
        <div className='max-w-7xl mx-auto'>
          <nav className='flex items-center space-x-2 text-sm text-gray-500'>
            <Link to='/' className='hover:text-orange-600 transition-colors'>Home</Link>
            <span>/</span>
            <Link to='/collection' className='hover:text-orange-600 transition-colors'>Collection</Link>
            <span>/</span>
            <span className='text-gray-900 font-medium truncate max-w-xs md:max-w-sm lg:max-w-md' title={productData.name}>{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-2 md:px-8 py-2'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>

          {/* Product Images */}
          <div className='space-y-4 relative'>
            {/* Main Image Gallery */}
            <div className='relative rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              <Swiper
                modules={[Pagination, Thumbs]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  renderBullet: function (index, className) {
                    return '<span class="' + className + ' bg-orange-500"></span>';
                  }
                }}
                thumbs={{ swiper: thumbsSwiper }}
                className='w-full aspect-square'
                onSwiper={setMainSwiper}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.activeIndex);
                  setImage(productData.image[swiper.activeIndex]);
                }}
              >
                {productData.image.map((item, index) => (
                  <SwiperSlide key={index} className='relative'>
                    <img
                      src={item}
                      alt={`${productData.name} - view ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute bottom-4 right-4'>
                      <img src={assets.logo_only} alt="logo" className="!w-12 !h-10 md:!w-24 md:!h-20 p-2 opacity-40" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Share and Wishlist buttons - positioned over the image gallery */}
            <div className='absolute top-4 right-4 flex flex-col gap-2 z-30'>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToWishlistPage();
                }}
                disabled={isWishlistLoading}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 border-2 ${isWishlistLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
                  } ${isWishlisted
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-red-300'
                  }`}
                title={isWishlistLoading ? 'Updating...' : (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist')}
                type="button"
              >
                {isWishlistLoading ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                )}
              </button>

              <button
                onClick={handleShareButtonClick}
                className='p-4 rounded-full bg-white shadow-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300'
                title="Share product"
              >
                <Share2 className='w-6 h-6' />
              </button>
            </div>

            {/* Share menu popup */}
            {showShareMenu && (
              <div
                ref={shareMenuRef}
                className="absolute top-36 !right-4 bg-white rounded-xl shadow-xl p-3 z-30 border border-gray-100"
                style={{
                  // maxWidth: '200px',
                  // left: popupPosition.left === 'auto' ? 'auto' : '0',
                  right: popupPosition.right,
                }}
              >
                <div className="flex flex-col gap-2">
                  <button
                    onClick={shareOnWhatsApp}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {/* <span className="text-sm font-medium">WhatsApp</span> */}
                  </button>

                  <button
                    onClick={shareOnInstagram}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    {/* <span className="text-sm font-medium">Instagram</span> */}
                  </button>

                  <button
                    onClick={shareViaMessage}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                    {/* <span className="text-sm font-medium">Share</span> */}
                  </button>
                </div>
              </div>
            )}

            {/* Thumbnail Gallery */}
            <div className='relative'>
              <Swiper
                modules={[Thumbs, Navigation]}
                spaceBetween={8}
                slidesPerView={isMobile ? 3 : 4}
                watchSlidesProgress={true}
                onSwiper={(swiper) => {
                  setThumbsSwiper(swiper);
                  setThumbsSwiperInstance(swiper);
                }}
                navigation={{
                  nextEl: '.swiper-button-next-thumbs',
                  prevEl: '.swiper-button-prev-thumbs',
                }}
                onSlideChange={(swiper) => {
                  // Update arrow opacity based on slide position
                  const prevButton = document.querySelector('.swiper-button-prev-thumbs');
                  const nextButton = document.querySelector('.swiper-button-next-thumbs');

                  if (prevButton) {
                    prevButton.style.opacity = swiper.isBeginning ? '0.3' : '1';
                  }
                  if (nextButton) {
                    nextButton.style.opacity = swiper.isEnd ? '0.3' : '1';
                  }

                  // Sync with main swiper when thumbnail changes
                  if (mainSwiper && mainSwiper.slideTo) {
                    mainSwiper.slideTo(swiper.activeIndex);
                  }
                }}
                className='w-full'
              >
                {productData.image.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeIndex === index
                        ? 'border-orange-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => {
                        // Update main swiper
                        if (mainSwiper && mainSwiper.slideTo) {
                          mainSwiper.slideTo(index);
                        }
                        // Update thumbnail swiper position
                        if (thumbsSwiperInstance && thumbsSwiperInstance.slideTo) {
                          thumbsSwiperInstance.slideTo(index);
                        }
                      }}
                    >
                      <img
                        src={item}
                        alt={`${productData.name} thumbnail ${index + 1}`}
                        className='w-full h-16 md:h-20 object-cover'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons for Thumbnails */}
              <div
                className='swiper-button-prev-thumbs absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer'
                style={{ opacity: thumbsSwiperInstance?.isBeginning ? 0.3 : 1 }}
              >
                <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </div>
              <div
                className='swiper-button-next-thumbs absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer'
                style={{ opacity: thumbsSwiperInstance?.isEnd ? 0.3 : 1 }}
              >
                <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className='space-y-6'>
            {/* Product Header */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <span className='px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full'>
                  {changeText}
                </span>
                <span className='px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
                  In Stock
                </span>
              </div>

              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 leading-tight'>
                {productData.name}
              </h1>

              {/* Rating */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  {stars.map((starValue) => (
                    <FaStar
                      key={starValue}
                      className={`w-4 h-4 ${averageRating >= starValue ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className='text-sm text-gray-600'>({reviewCount} reviews)</span>
                <span className='text-sm text-gray-400'>|</span>
                <span className='text-sm text-gray-600'>★★★★★</span>
              </div>
            </div>

            {/* Price */}
            <div className='space-y-2'>
              <div className='flex items-center gap-4'>
                <span className='text-3xl md:text-4xl font-bold text-gray-900'>
                  {currency} {productData.price}
                </span>
                {productData.beforePrice && (
                  <span className='text-xl text-gray-500 line-through'>
                    {currency} {productData.beforePrice}
                  </span>
                )}
                {productData.beforePrice && (
                  <span className='px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded'>
                    {Math.round(((productData.beforePrice - productData.price) / productData.beforePrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Combo Pricing Display */}
              {productData.comboPrices && productData.comboPrices.length > 0 && (
                <div className='mt-4 space-y-3'>
                  <div className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Combo Offers</div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {productData.comboPrices.map((combo, index) => (
                      <div key={index} className='bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 hover:shadow-md transition-all duration-300'>
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center'>
                              <span className='text-white font-bold text-lg'>{combo.quantity}x</span>
                            </div>
                            <div>
                              <div className='font-bold text-gray-900'>{currency} {combo.price} each</div>
                              <div className='text-sm text-gray-600'>Total: {currency} {combo.quantity * combo.price}</div>
                            </div>
                          </div>
                          {combo.discount > 0 && (
                            <div className='text-right'>
                              <div className='text-sm font-bold text-green-600'>{combo.discount}% OFF</div>
                              <div className='text-xs text-gray-500'>Save {currency} {Math.round((combo.quantity * combo.price * combo.discount) / 100)}</div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => addToCartCombo(productData._id, combo.quantity, size || 'M')}
                          disabled={productData.soldout}
                          className='w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6.5' />
                          </svg>
                          Add {combo.quantity} to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className='space-y-3'>
              <p className='text-gray-600 leading-relaxed'>
                {productData.description}
              </p>
              {/* {productData.description.length > 100 && (
                <button
                  onClick={toggleDescription}
                  className='text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors'
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )} */}
            </div>

            {/* Size Selection */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-base font-semibold text-gray-900'>Select Size</h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='text-orange-600 hover:text-orange-700 text-xs font-medium underline transition-colors duration-200'
                >
                  Size Guide
                </button>
              </div>

              <div className='grid grid-cols-4 gap-3'>
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`relative h-12 rounded-xl border-2 font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${item === size
                      ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200'
                      : 'border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700'
                      }`}
                  >
                    <span className='absolute inset-0 flex items-center justify-center'>
                      {item}
                    </span>
                    {item === size && (
                      <div className='absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center'>
                        <svg className='w-2.5 h-2.5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className='space-y-3'>
              <h3 className='text-base font-semibold text-gray-900'>Quantity</h3>
              <div className='flex items-center gap-4'>
                <div className='flex items-center border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all duration-200 border-r border-gray-200'
                  >
                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M20 12H4' />
                    </svg>
                  </button>
                  <span className='w-16 h-12 flex items-center justify-center text-lg font-bold text-gray-900 bg-white'>
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      const maxStock = productData.stock || Infinity;
                      setQuantity(Math.min(quantity + 1, maxStock));
                    }}
                    className='w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all duration-200 border-l border-gray-200'
                  >
                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M12 4v16m8-8H4' />
                    </svg>
                  </button>
                </div>
                <span className='text-sm text-gray-500 font-medium'>
                  {productData.stock || 'Unlimited'} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-4'>
                <button
                  onClick={addCartPageDetails}
                  className='w-full bg-orange-600 hover:bg-orange-700 text-white mb-2 md:mb-4 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
                >
                  Add to Cart
                </button>
                <button
                  onClick={buyNowHandler}
                  className={`w-full bg-gray-900 hover:bg-gray-800 text-white mb-1 md:mb-4 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${buyNow}`}
                >
                  Buy Now
                </button>
              </div>




              {/* Why Choose Us - Minimal */}
              {/* Shipping & Benefits Info */}
              <div className='mt-6 space-y-4'>
                {/* Free Delivery Banner */}
                <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200'>
                  <div className='flex items-center justify-center space-x-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm'>
                      <Truck className='w-5 h-5 text-white' />
                    </div>
                    <div className='text-center'>
                      <h3 className='text-sm font-bold text-green-800'>🚚 Free Delivery</h3>
                      <p className='text-xs text-green-700'>On orders above ₹500</p>
                    </div>
                  </div>
                </div>

                {/* Benefits Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  {/* Secure Payment */}
                  <div className='flex items-center justify-center space-x-2 bg-blue-50 rounded-lg p-3 border border-blue-100'>
                    <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                      <Shield className='w-4 h-4 text-white' />
                    </div>
                    <div className='text-center'>
                      <p className='text-xs font-semibold text-blue-800'>Secure</p>
                      <p className='text-xs text-blue-600'>Payment</p>
                    </div>
                  </div>

                  {/* Easy Returns */}
                  <div className='flex items-center justify-center space-x-2 bg-purple-50 rounded-lg p-3 border border-purple-100'>
                    <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                      <RotateCcw className='w-4 h-4 text-white' />
                    </div>
                    <div className='text-center'>
                      <p className='text-xs font-semibold text-purple-800'>Easy</p>
                      <p className='text-xs text-purple-600'>Returns</p>
                    </div>
                  </div>

                  {/* Quality Guarantee */}
                  <div className='flex items-center justify-center space-x-2 bg-orange-50 rounded-lg p-3 border border-orange-100'>
                    <div className='w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center'>
                      <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <div className='text-center'>
                      <p className='text-xs font-semibold text-orange-800'>Quality</p>
                      <p className='text-xs text-orange-600'>Guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className='mt-6 md:mt-16 rounded-2xl shadow-sm border border-gray-100 py-8 px-4'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>Product Features</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            <div className='text-center space-y-3'>
              <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto'>
                <Paintbrush className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Design</p>
                <p className='font-semibold text-gray-900'>{productData.design || changeText || "Custom Print"}</p>
              </div>
            </div>
            <div className='text-center space-y-3'>
              <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto'>
                <Shirt className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Fit</p>
                <p className='font-semibold text-gray-900'>{productData.fit || "Oversized"}</p>
              </div>
            </div>
            <div className='text-center space-y-3'>
              <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto'>
                <Circle className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Neck</p>
                <p className='font-semibold text-gray-900'>{productData.neck || "Round Neck"}</p>
              </div>
            </div>
            <div className='text-center space-y-3'>
              <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto'>
                <Leaf className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Material</p>
                <p className='font-semibold text-gray-900'>{productData.material || "Cotton"}</p>
              </div>
            </div>
            <div className='text-center space-y-3'>
              <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto'>
                <Calendar className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Occasion</p>
                <p className='font-semibold text-gray-900'>{productData.occasion || "Casual Wear"}</p>
              </div>
            </div>
            <div className='text-center space-y-3'>
              <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto'>
                <Hand className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Sleeve Style</p>
                <p className='font-semibold text-gray-900'>{productData.sleeveStyle || "Half Sleeve"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Images */}
        {productData.reviewImage && productData.reviewImage.length > 0 && (
          <div className='mt-8 md:mt-16 rounded-2xl shadow-sm border border-gray-100 p-4 md:p-2'>
            <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6'>Customer Reviews</h2>

            {/* Mobile Design - Slider */}
            <div className='md:hidden'>
              <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={12}
                slidesPerView={2.5}
                centeredSlides={false}
                loop={false}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  renderBullet: function (index, className) {
                    return '<span class="' + className + ' bg-orange-500 w-2 h-2"></span>';
                  }
                }}
                navigation={{
                  nextEl: '.swiper-button-next-reviews',
                  prevEl: '.swiper-button-prev-reviews',
                }}
                className='w-full pb-8'
                breakpoints={{
                  320: {
                    slidesPerView: 2.2,
                    spaceBetween: 8,
                  },
                  375: {
                    slidesPerView: 2.5,
                    spaceBetween: 10,
                  },
                  425: {
                    slidesPerView: 3,
                    spaceBetween: 12,
                  },
                }}
              >
                {productData.reviewImage.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className='group cursor-pointer'>
                      <div className='aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-sm'>
                        <img
                          src={item}
                          alt={`Customer review ${index + 1}`}
                          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          onClick={() => openModalOne(index)}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <div className='swiper-button-prev-reviews absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all duration-200'>
                  <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                  </svg>
                </div>
                <div className='swiper-button-next-reviews absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all duration-200'>
                  <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </div>
              </Swiper>
            </div>

            {/* Desktop Design - Grid */}
            <div className='hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-4'>
              {productData.reviewImage.map((item, index) => (
                <div key={index} className='group cursor-pointer'>
                  <div className='aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-orange-300 transition-all duration-300'>
                    <img
                      src={item}
                      alt={`Customer review ${index + 1}`}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      onClick={() => openModalOne(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Description */}
        <div className='mt-8 md:mt-16 rounded-2xl shadow-sm border border-gray-100 p-2'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Product Description</h2>
          <div className='prose prose-gray max-w-none'>
            <p className='text-gray-600 leading-relaxed mb-4'>
              Unleash your inner trendsetter with the <span className='font-semibold text-gray-900'>Inkdapper {productData.name} T-shirt</span>! Crafted for those who love to stand out, this oversized tee combines comfort with bold, custom style. Featuring unique DTF sticker prints and a striking bleach design, it's the perfect choice for anyone who wants to express their individuality.
            </p>
            {(!isMobile || isExpanded) && (
              <p className='text-gray-600 leading-relaxed mb-4'>
                Made from 100% soft, breathable cotton jersey, this oversized t-shirt offers a relaxed fit for all-day comfort. The custom DTF prints and bleach effects ensure every piece is one-of-a-kind, making your look as unique as you are. Easy to care for: simply toss it in the wash with the rest of your laundry.
              </p>
            )}
            {isExpanded && (
              <>
                <p className='text-gray-600 leading-relaxed mb-4'>
                  The oversized silhouette makes it a versatile addition to your wardrobe—pair it with jeans for a streetwear vibe or layer it for a more creative, layered look. Whether you're lounging at home, heading out with friends, or making a statement on the go, this tee brings effortless cool to any setting.
                </p>
                <p className='text-gray-600 leading-relaxed mb-4'>
                  For those who believe fashion is about self-expression, this t-shirt is your invitation to break the mold. Ready to upgrade your style? Make your mark with Inkdapper's custom oversized tees!
                </p>
              </>
            )}
            {productData.description.length > 100 && (
              <button
                onClick={toggleDescription}
                className='text-orange-600 hover:text-orange-700 font-medium transition-colors'
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900 text-lg'>Product Specifications</h3>
              <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
                <div className='flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0'>
                  <span className='text-sm text-gray-600 font-medium'>Fit:</span>
                  <span className='text-sm text-gray-900 font-semibold'>Oversized</span>
                </div>
                <div className='flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0'>
                  <span className='text-sm text-gray-600 font-medium'>Material:</span>
                  <span className='text-sm text-gray-900 font-semibold'>100% Cotton</span>
                </div>
                <div className='flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0'>
                  <span className='text-sm text-gray-600 font-medium'>Neck:</span>
                  <span className='text-sm text-gray-900 font-semibold'>Round Neck</span>
                </div>
                <div className='flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0'>
                  <span className='text-sm text-gray-600 font-medium'>Sleeve:</span>
                  <span className='text-sm text-gray-900 font-semibold'>Half Sleeve</span>
                </div>
              </div>
            </div>
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900 text-lg'>Care Instructions</h3>
              <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
                <div className='flex items-start gap-3 py-2'>
                  <span className='text-orange-500 font-bold'>•</span>
                  <span className='text-sm text-gray-700'>Machine wash cold</span>
                </div>
                <div className='flex items-start gap-3 py-2'>
                  <span className='text-orange-500 font-bold'>•</span>
                  <span className='text-sm text-gray-700'>Tumble dry low</span>
                </div>
                <div className='flex items-start gap-3 py-2'>
                  <span className='text-orange-500 font-bold'>•</span>
                  <span className='text-sm text-gray-700'>Do not bleach</span>
                </div>
                <div className='flex items-start gap-3 py-2'>
                  <span className='text-orange-500 font-bold'>•</span>
                  <span className='text-sm text-gray-700'>Iron on low heat if needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className='mt-8 md:mt-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ProductReviewSection productId={productData._id} />
            <ListReviews productId={productData._id} showSyncButton={false} />
          </div>
        </div>

        {/* Related Products */}
        <div className='mt-10 md:mt-16'>
          <RelatedProducts
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
          />
        </div>
      </div>

      {/* Size Guide Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200 flex items-center justify-between'>
              <h3 className='text-xl font-bold text-gray-900'>Size Guide</h3>
              <button
                onClick={closeModal}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='p-6'>
              <img src={assets.product_size} alt='Size guide' className='w-full h-auto' />
            </div>
          </div>
        </div>
      )}

      {/* Review Images Modal */}
      {isModalOpenOne && (
        <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>Customer Reviews</h3>
              <button
                onClick={closeModalOne}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='p-4'>
              <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className='w-full'
                initialSlide={currentImageIndex}
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
              >
                {productData.reviewImage.map((item, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={item}
                      alt={`Customer review ${index + 1}`}
                      className='w-full h-auto max-h-[70vh] object-contain'
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='text-6xl font-bold text-gray-300'>404</div>
        <h1 className='text-2xl font-semibold text-gray-600'>Product Not Found</h1>
        <p className='text-gray-500 max-w-md'>
          The product you're looking for doesn't exist or has been removed.
          Please check the URL and try again.
        </p>
        <Link
          to='/collection'
          className='inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors'
        >
          Browse Products
        </Link>
      </div>
    </div>
  )
}

export default Product
