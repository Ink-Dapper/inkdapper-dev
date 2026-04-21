import React, { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { storageUrl } from '../utils/storageUrl';
import '../styles/swiper-custom.css';
import { Paintbrush, Shirt, Circle, Leaf, Calendar, Hand, Truck, Shield, RotateCcw, Heart, Share2, Star } from 'lucide-react';

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

// Helper to safely generate a slug from a product name
const generateSlugFromName = (name) => {
  if (!name) return '';
  let safeSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  if (safeSlug.endsWith('-')) safeSlug = safeSlug.slice(0, -1);
  return safeSlug;
};

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const context = useContext(ShopContext)

  // Safety check to prevent destructuring undefined context
  if (!context) {
    return <div>Loading...</div>
  }

  const { products, currency, addToCart, addToCartCombo, token, getCartCount, addToWishlist, getWishlistCount, reviewList, scrollToTop, cartItems, updateQuantity, addToRecentlyViewed } = context
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [wishlistCta, setWishlistCta] = useState('hidden')
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
  const fetchProductData = async () => {
    if (!products || products.length === 0 || !slug) return;

    const foundProduct = products.find((item) => {
      if (item.slug) {
        return item.slug === slug;
      }
      // Fallback to name-based slug if slug is missing on the product
      return generateSlugFromName(item.name) === slug;
    });

    if (foundProduct) {
      setProductData(foundProduct);
      if (foundProduct.image && foundProduct.image.length > 0) {
        setImage(foundProduct.image[0]);
      }
    } else {
      setProductData(false);
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

  const handleBuyNow = () => {
    if (!token) {
      toast.error('Please login to continue', { autoClose: 1000 })
    } else if (!size) {
      toast.error('Select Product Size', { autoClose: 2000, pauseOnHover: false, transition: Flip })
    } else {
      const existingQuantity = cartItems[productData._id]?.[size] || 0;
      const newQuantity = existingQuantity + quantity;
      const maxStock = productData.stock;
      if (maxStock && newQuantity > maxStock) {
        toast.error(`Only ${maxStock} items available in stock`, { autoClose: 2000, transition: Flip });
        return;
      }
      updateQuantity(productData._id, size, newQuantity);
      scrollToTop();
      navigate('/place-order');
    }
  }

  const addToWishlistPage = () => {
    if (!token) {
      toast.error('Please login to add product to wishlist', { autoClose: 1000, })
    } else {
      addToWishlist(productData._id)
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
        autoClose: 1000, pauseOnHover: false,
        transition: Flip
      })

      if (wishlistCount >= 0) {
        setWishlistCta('block')
      }
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
    if (!productData) return;
    const productReviews = reviewList.filter(item => item.productId === productData._id);
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

    const productUrl = `${window.location.origin}/product/${productData.slug}`;
    const firstImage = productData.image && productData.image.length > 0 ? productData.image[0] : '';
    const shareText = `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}\n${productUrl}${firstImage ? `\n${firstImage}` : ''}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
    toast.success('Opening WhatsApp sharing...', { autoClose: 1500 });
  };

  const shareOnInstagram = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${productData.slug}`;
    const firstImage = productData.image && productData.image.length > 0 ? productData.image[0] : '';
    const textToCopy = firstImage ? `${productUrl}\n${firstImage}` : productUrl;
    navigator.clipboard.writeText(textToCopy);

    toast.info('Link copied! Open Instagram and paste in your story or message', { autoClose: 3000 });
    setShowShareMenu(false);
  };

  const shareViaMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${productData.slug}`;
    const firstImage = productData.image && productData.image.length > 0 ? productData.image[0] : '';
    const shareText = `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}\n${productUrl}${firstImage ? `\n${firstImage}` : ''}`;

    if (navigator.share) {
      navigator.share({
        title: productData.name,
        text: shareText,
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

  useEffect(() => {
    fetchProductData();
  }, [slug, products]);

  // Update review counts and labels when product or reviews change
  useEffect(() => {
    if (productData) {
      getProductReviewCount();
      createNew();
    }
  }, [productData, reviewList]);

  // Separate useEffect for recently viewed to avoid conflicts
  useEffect(() => {
    if (productData) {
      addToRecentlyViewed(productData)
    }
  }, [productData])

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

  const productUrl = productData ? `https://www.inkdapper.com/product/${productData.slug}` : ''
  const productImage = productData?.image?.[0] ? storageUrl(productData.image[0]) : 'https://www.inkdapper.com/ink_dapper_logo.svg'
  const productTitle = productData ? `${productData.name} | Ink Dapper` : 'Product | Ink Dapper'
  const productDescription = productData
    ? `Buy ${productData.name} at Ink Dapper — ${productData.description?.slice(0, 120) || 'Premium oversized streetwear, custom DTF prints, acid wash tees'}. ₹${productData.price}. Free shipping in India.`
    : 'Explore streetwear at Ink Dapper.'

  const jsonLd = productData ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productData.name,
    image: productData.image?.map(img => storageUrl(img)) || [],
    description: productData.description || `${productData.name} — premium streetwear by Ink Dapper.`,
    sku: productData._id,
    brand: { '@type': 'Brand', name: 'Ink Dapper' },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: productData.price,
      availability: productData.soldout ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Ink Dapper' },
    },
    ...(averageRating > 0 && reviewCount > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      }
    } : {})
  } : null

  return productData ? (
    <div className='min-h-screen ragged-section'>
      <Helmet>
        <title>{productTitle}</title>
        <meta name="description" content={productDescription} />
        <link rel="canonical" href={productUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        <meta property="og:title" content={productTitle} />
        <meta property="og:description" content={productDescription} />
        <meta property="og:image" content={productImage} />
        <meta property="og:site_name" content="Ink Dapper" />
        <meta property="product:price:amount" content={productData.price} />
        <meta property="product:price:currency" content="INR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productTitle} />
        <meta name="twitter:description" content={productDescription} />
        <meta name="twitter:image" content={productImage} />
        {jsonLd && (
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )}
      </Helmet>

      <div className='ragged-noise' />

      {/* Breadcrumb */}
      <div className='relative py-3 px-4 md:px-8' style={{ borderBottom: '1px solid rgba(249,115,22,0.15)', background: 'rgba(10,10,11,0.85)' }}>
        <div className='absolute left-0 top-0 bottom-0 w-0.5' style={{ background: 'linear-gradient(180deg, #f97316, rgba(249,115,22,0.1))' }} />
        <div className='max-w-7xl mx-auto'>
          <nav className='flex items-center space-x-2 text-sm !bg-transparent'>
            <Link to='/' className='hover:text-orange-400 transition-colors text-slate-500 font-medium'>Home</Link>
            <span className='text-orange-500/40 font-bold'>/</span>
            <Link to='/collection' className='hover:text-orange-400 transition-colors text-slate-500 font-medium'>Collection</Link>
            <span className='text-orange-500/40 font-bold'>/</span>
            <span className='text-slate-200 font-semibold truncate max-w-xs md:max-w-sm lg:max-w-md' title={productData.name}>{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-2 md:px-8 py-6 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14'>

          {/* Product Images */}
          <div className='space-y-4'>
            {/* Corner accent */}
            <div className='absolute top-0 left-0 w-16 h-16 pointer-events-none' style={{ background: 'radial-gradient(circle at 0% 0%, rgba(249,115,22,0.18), transparent 70%)' }} />
            {/* Main Image Gallery */}
            <div className='relative rounded-2xl overflow-hidden' style={{ border: '1px solid rgba(249,115,22,0.25)', boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.05) inset' }}>
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
                      src={storageUrl(item)}
                      alt={`${productData.name} - view ${index + 1}`}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.style.background = '#0d0d10';
                      }}
                    />
                    <div className='absolute bottom-4 right-4'>
                      <img src={assets.logo_only} alt="logo" className="!w-12 !h-10 md:!w-24 md:!h-20 p-2 opacity-40" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Share and Wishlist buttons */}
              <div className='absolute top-4 right-4 flex flex-col gap-2 z-20'>
                <button
                  onClick={addToWishlistPage}
                  className={`p-3 rounded-full transition-all duration-300 border ${isWishlisted ? 'bg-red-500 border-red-500 text-white shadow-[0_0_16px_rgba(239,68,68,0.4)]' : 'border-orange-500/40 text-orange-300 hover:bg-orange-500/20'}`}
                  style={{ background: isWishlisted ? undefined : 'rgba(13,13,14,0.85)', backdropFilter: 'blur(8px)' }}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShareButtonClick}
                  className='p-3 rounded-full border border-orange-500/40 text-orange-300 hover:bg-orange-500/20 transition-all duration-300'
                  style={{ background: 'rgba(13,13,14,0.85)', backdropFilter: 'blur(8px)' }}
                >
                  <Share2 className='w-5 h-5' />
                </button>
              </div>

              {/* Share menu popup */}
              {showShareMenu && (
                <div
                  ref={shareMenuRef}
                  className="absolute top-28 right-4 rounded-2xl p-3 z-30"
                  style={{ background: 'rgba(13,13,14,0.97)', border: '1px solid rgba(249,115,22,0.2)', boxShadow: '0 0 24px rgba(249,115,22,0.12), 0 16px 40px rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
                >
                  <div className="absolute top-0 left-0 w-full h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }} />
                  <div className="flex flex-col gap-2">
                    {/* WhatsApp */}
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                      title="WhatsApp"
                    >
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                    {/* Instagram */}
                    <button
                      onClick={shareOnInstagram}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)' }}
                      title="Instagram"
                    >
                      <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </button>
                    {/* Share / Copy */}
                    <button
                      onClick={shareViaMessage}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
                      title="Share"
                    >
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                        ? 'border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                        : 'border-slate-700 hover:border-orange-500/50'
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
                        src={storageUrl(item)}
                        alt={`${productData.name} thumbnail ${index + 1}`}
                        className='w-full h-16 md:h-20 object-cover'
                        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons for Thumbnails */}
              <div
                className='swiper-button-prev-thumbs absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200'
                style={{ background: 'rgba(13,13,14,0.9)', border: '1px solid rgba(249,115,22,0.35)', opacity: thumbsSwiperInstance?.isBeginning ? 0.3 : 1 }}
              >
                <svg className='w-4 h-4 text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </div>
              <div
                className='swiper-button-next-thumbs absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200'
                style={{ background: 'rgba(13,13,14,0.9)', border: '1px solid rgba(249,115,22,0.35)', opacity: thumbsSwiperInstance?.isEnd ? 0.3 : 1 }}
              >
                <svg className='w-4 h-4 text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className='space-y-5 lg:pl-6 lg:border-l' style={{ borderColor: 'rgba(249,115,22,0.12)' }}>
            {/* Product Header */}
            <div className='space-y-3'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='ragged-pill text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 inline-flex items-center gap-1.5'>
                  <span className='w-1.5 h-1.5 bg-orange-400 rounded-full' />
                  {changeText}
                </span>
                {!productData.soldout && (
                  <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold' style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                    In Stock
                  </span>
                )}
              </div>

              <h1 className='ragged-title leading-tight' style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                {productData.name}
              </h1>

              {/* Rating */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-0.5'>
                  {stars.map((starValue) => (
                    <Star key={starValue} className='w-4 h-4' fill={averageRating >= starValue ? '#facc15' : 'none'} stroke={averageRating >= starValue ? '#facc15' : '#334155'} />
                  ))}
                </div>
                <span className='text-sm text-slate-500'>({reviewCount} reviews)</span>
                <span className='text-slate-700'>|</span>
                <span className='text-sm text-yellow-400 tracking-wider'>★★★★★</span>
              </div>
            </div>

            {/* Price */}
            <div className='py-4 border-y border-orange-500/15 space-y-3'>
              <div className='flex items-center gap-4 flex-wrap'>
                <span className='font-extrabold text-white' style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.03em' }}>
                  {currency} {productData.price}
                </span>
                {productData.beforePrice && (
                  <span className='text-xl text-slate-600 line-through'>{currency} {productData.beforePrice}</span>
                )}
                {productData.beforePrice && (
                  <span className='px-2.5 py-1 rounded-lg text-sm font-bold' style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                    {Math.round(((productData.beforePrice - productData.price) / productData.beforePrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* You save + stock urgency row */}
              <div className='flex items-center gap-3 flex-wrap'>
                {productData.beforePrice && productData.beforePrice > productData.price && (
                  <span className='inline-flex items-center gap-1.5 text-sm font-bold' style={{ color: '#34d399' }}>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' /></svg>
                    You save {currency}{productData.beforePrice - productData.price}
                  </span>
                )}
                {productData.stock > 0 && productData.stock <= 10 && (
                  <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse' style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}>
                    <span className='w-1.5 h-1.5 rounded-full bg-red-400' />
                    Only {productData.stock} left in stock!
                  </span>
                )}
              </div>

              {/* Combo Pricing */}
              {productData.comboPrices && productData.comboPrices.length > 0 && (
                <div className='space-y-3'>
                  <div className='text-[11px] font-extrabold text-orange-400 uppercase tracking-[0.18em]'>Combo Offers</div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {productData.comboPrices.map((combo, index) => (
                      <div key={index} className='rounded-xl p-4 transition-all duration-300' style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}>
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0' style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.35), rgba(245,158,11,0.25))', border: '1px solid rgba(249,115,22,0.3)' }}>
                              <span className='text-orange-300 font-extrabold text-lg' style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{combo.quantity}x</span>
                            </div>
                            <div>
                              <div className='font-bold text-white text-sm'>{currency} {combo.price} each</div>
                              <div className='text-xs text-slate-500'>Total: {currency} {combo.quantity * combo.price}</div>
                            </div>
                          </div>
                          {combo.discount > 0 && (
                            <div className='text-right'>
                              <div className='text-sm font-bold text-emerald-400'>{combo.discount}% OFF</div>
                              <div className='text-xs text-slate-600'>Save {currency} {Math.round((combo.quantity * combo.price * combo.discount) / 100)}</div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => addToCartCombo(productData._id, combo.quantity, size || 'M')}
                          disabled={productData.soldout}
                          className='w-full ragged-solid-btn py-2.5 px-4 font-bold text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          Add {combo.quantity} to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <p className='text-slate-400 leading-relaxed text-sm'>{productData.description}</p>

            {/* Size Selection */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='text-xs font-extrabold text-slate-500 uppercase tracking-[0.18em]'>Select Size</h3>
                <button onClick={() => setIsModalOpen(true)} className='text-orange-400 hover:text-orange-300 text-xs font-bold underline transition-colors duration-200'>
                  Size Guide
                </button>
              </div>
              <div className='grid grid-cols-4 gap-3'>
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`relative h-12 rounded-xl border-2 font-bold text-sm transition-all duration-300 hover:scale-105 ${item === size ? 'border-orange-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.35)]' : 'border-slate-700 text-slate-700 hover:border-orange-500/50 hover:text-orange-300'}`}
                    style={{ background: item === size ? 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(245,158,11,0.15))' : 'rgba(255,255,255,0.03)' }}
                  >
                    <span className='absolute inset-0 flex items-center justify-center text-slate-100'>{item}</span>
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
              <h3 className='text-xs font-extrabold text-slate-500 uppercase tracking-[0.18em]'>Quantity</h3>
              <div className='flex items-center gap-4'>
                <div className='flex items-center rounded-xl overflow-hidden' style={{ border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(255,255,255,0.03)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className='w-12 h-12 flex items-center justify-center text-orange-400 hover:bg-orange-500/15 transition-all duration-200 border-r border-orange-500/20'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M20 12H4' /></svg>
                  </button>
                  <span className='w-16 h-12 flex items-center justify-center text-lg font-bold text-white'>{quantity}</span>
                  <button onClick={() => { const maxStock = productData.stock || Infinity; setQuantity(Math.min(quantity + 1, maxStock)); }} className='w-12 h-12 flex items-center justify-center text-orange-400 hover:bg-orange-500/15 transition-all duration-200 border-l border-orange-500/20'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M12 4v16m8-8H4' /></svg>
                  </button>
                </div>
                <span className='text-sm text-slate-500 font-medium'>{productData.stock > 10 ? `${productData.stock} available` : productData.stock ? '' : 'In stock'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              {/* Primary CTA — Add to Cart */}
              <button
                onClick={addCartPageDetails}
                className='w-full py-4 px-6 rounded-2xl font-extrabold text-base uppercase tracking-widest text-white flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'
                style={{ background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)', boxShadow: '0 0 28px rgba(249,115,22,0.45), 0 4px 16px rgba(0,0,0,0.3)' }}
              >
                <svg className='w-5 h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
                Add to Cart
              </button>

              {/* Buy Now — skip cart, go straight to checkout */}
              <button
                onClick={handleBuyNow}
                className='w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-widest text-white border border-white/12 hover:border-orange-500/40 hover:text-orange-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2'
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
              >
                <svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' /></svg>
                Buy Now — Checkout Instantly
              </button>

              {/* Wishlist button — full width, always visible */}
              <button
                onClick={addToWishlistPage}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 ${isWishlisted ? 'border-red-400/40 text-red-300 hover:border-red-400/60' : 'border-slate-700/60 text-slate-500 hover:border-orange-500/40 hover:text-orange-300'}`}
                style={{ background: isWishlisted ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)', boxShadow: isWishlisted ? '0 0 18px rgba(239,68,68,0.18)' : 'none' }}
              >
                <Heart className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isWishlisted ? 'fill-red-400 text-red-400' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>

              {/* View Wishlist CTA */}
              <Link to='/wishlist' className={wishlistCta} onClick={scrollToTop}>
                <div className='flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer border border-red-500/20 hover:border-red-500/35'
                  style={{ background: 'rgba(239,68,68,0.05)' }}>
                  <Heart className='w-3.5 h-3.5 fill-current flex-shrink-0' />
                  View Wishlist
                  <svg className='w-3.5 h-3.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' /></svg>
                </div>
              </Link>

              {/* Trust mini bar */}
              <div className='rounded-xl p-3' style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)' }}>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-md flex items-center justify-center bg-orange-500/80'><Truck className='w-3 h-3 text-white' /></div>
                    <span className='text-xs font-semibold text-slate-400'>Free Shipping</span>
                  </div>
                  <div className='w-px h-4 bg-orange-500/20' />
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-md flex items-center justify-center bg-blue-500/80'><Shield className='w-3 h-3 text-white' /></div>
                    <span className='text-xs font-semibold text-slate-400'>Secure Pay</span>
                  </div>
                  <div className='w-px h-4 bg-orange-500/20' />
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-md flex items-center justify-center bg-emerald-500/80'><RotateCcw className='w-3 h-3 text-white' /></div>
                    <span className='text-xs font-semibold text-slate-400'>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className='relative my-8 md:my-12'>
          <div className='h-px' style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(249,115,22,0.2), transparent)' }} />
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full' style={{ background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.6)' }} />
        </div>

        {/* Product Features */}
        <div className='relative ragged-section rounded-2xl py-8 px-5 overflow-hidden' style={{ border: '1px solid rgba(249,115,22,0.22)' }}>
          <div className='ragged-divider' />
          <div className='flex items-center gap-3 mt-4 mb-8'>
            <div className='w-1 h-7 rounded-full flex-shrink-0' style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
            <h2 className='ragged-title' style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Product Features</h2>
            <div className='flex-1 h-px' style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.4), transparent)' }} />
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            {[
              { icon: <Paintbrush className='w-6 h-6 text-orange-400' />, label: 'Design', value: productData.design || changeText || 'Custom Print' },
              { icon: <Shirt className='w-6 h-6 text-orange-400' />, label: 'Fit', value: productData.fit || 'Oversized' },
              { icon: <Circle className='w-6 h-6 text-orange-400' />, label: 'Neck', value: productData.neck || 'Round Neck' },
              { icon: <Leaf className='w-6 h-6 text-orange-400' />, label: 'Material', value: productData.material || 'Cotton' },
              { icon: <Calendar className='w-6 h-6 text-orange-400' />, label: 'Occasion', value: productData.occasion || 'Casual Wear' },
              { icon: <Hand className='w-6 h-6 text-orange-400' />, label: 'Sleeve Style', value: productData.sleeveStyle || 'Half Sleeve' },
            ].map(({ icon, label, value }) => (
              <div key={label} className='text-center space-y-3'>
                <div className='w-12 h-12 rounded-xl flex items-center justify-center mx-auto' style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
                  {icon}
                </div>
                <div>
                  <p className='text-xs text-slate-500 uppercase tracking-wider'>{label}</p>
                  <p className='font-semibold text-slate-200 text-sm mt-0.5'>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Images */}
        {/* {!productData.soldout &&
          (productData.stock === undefined || productData.stock > 0) &&
          productData.reviewImage &&
          productData.reviewImage.length > 0 && (
            <div className='mt-8 md:mt-16 rounded-2xl shadow-sm border border-gray-100 p-4 md:p-2'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6'>Customer Reviews</h2>

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
          )} */}

        {/* Section Divider */}
        <div className='relative my-8 md:my-12'>
          <div className='h-px' style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(249,115,22,0.2), transparent)' }} />
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full' style={{ background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.6)' }} />
        </div>

        {/* Product Description */}
        <div className='relative ragged-section rounded-2xl p-5 md:p-8 overflow-hidden' style={{ border: '1px solid rgba(249,115,22,0.22)' }}>
          <div className='ragged-divider' />
          <div className='flex items-center gap-3 mt-4 mb-6'>
            <div className='w-1 h-7 rounded-full flex-shrink-0' style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
            <h2 className='ragged-title' style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Product Description</h2>
            <div className='flex-1 h-px' style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.4), transparent)' }} />
          </div>
          <div className='max-w-none'>
            <p className='text-slate-400 leading-relaxed mb-4'>
              Unleash your inner trendsetter with the <span className='font-semibold text-orange-500 underline'>Inkdapper {productData.name} T-shirt !</span> Crafted for those who love to stand out, this oversized tee combines comfort with bold, custom style. Featuring unique DTF sticker prints and a striking bleach design, it's the perfect choice for anyone who wants to express their individuality.
            </p>
            {(!isMobile || isExpanded) && (
              <p className='text-slate-400 leading-relaxed mb-4'>
                Made from 100% soft, breathable cotton jersey, this oversized t-shirt offers a relaxed fit for all-day comfort. The custom DTF prints and bleach effects ensure every piece is one-of-a-kind, making your look as unique as you are. Easy to care for: simply toss it in the wash with the rest of your laundry.
              </p>
            )}
            {isExpanded && (
              <>
                <p className='text-slate-400 leading-relaxed mb-4'>
                  The oversized silhouette makes it a versatile addition to your wardrobe—pair it with jeans for a streetwear vibe or layer it for a more creative, layered look. Whether you're lounging at home, heading out with friends, or making a statement on the go, this tee brings effortless cool to any setting.
                </p>
                <p className='text-slate-400 leading-relaxed mb-4'>
                  For those who believe fashion is about self-expression, this t-shirt is your invitation to break the mold. Ready to upgrade your style? Make your mark with Inkdapper's custom oversized tees!
                </p>
              </>
            )}
            {productData.description.length > 100 && (
              <button
                onClick={toggleDescription}
                className='text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm'
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-3'>
              <h3 className='font-semibold text-slate-200 text-base uppercase tracking-wider text-orange-400'>Product Specifications</h3>
              <div className='rounded-xl p-4 space-y-1' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.12)' }}>
                {[
                  { label: 'Fit', value: 'Oversized' },
                  { label: 'Material', value: '100% Cotton' },
                  { label: 'Neck', value: 'Round Neck' },
                  { label: 'Sleeve', value: 'Half Sleeve' },
                ].map(({ label, value }, i, arr) => (
                  <div key={label} className='flex items-center justify-between py-2' style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(249,115,22,0.08)' : 'none' }}>
                    <span className='text-sm text-slate-500 font-medium'>{label}:</span>
                    <span className='text-sm text-slate-200 font-semibold'>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='space-y-3'>
              <h3 className='font-semibold text-base uppercase tracking-wider text-orange-400'>Care Instructions</h3>
              <div className='rounded-xl p-4 space-y-1' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.12)' }}>
                {['Machine wash cold', 'Tumble dry low', 'Do not bleach', 'Iron on low heat if needed'].map((item) => (
                  <div key={item} className='flex items-start gap-3 py-2'>
                    <span className='text-orange-500 font-bold mt-0.5'>•</span>
                    <span className='text-sm text-slate-500'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className='relative my-8 md:my-12'>
          <div className='h-px' style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(249,115,22,0.2), transparent)' }} />
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full' style={{ background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.6)' }} />
        </div>

        {/* Reviews Section */}
        <div>
          <div className='flex items-center gap-3 mb-8'>
            <div className='w-1 h-7 rounded-full flex-shrink-0' style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
            <h2 className='ragged-title' style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>Customer Reviews</h2>
            <div className='flex-1 h-px' style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.4), transparent)' }} />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ProductReviewSection productId={productData._id} />
            <ListReviews />
          </div>
        </div>

        {/* Related Products */}
        <div className='mt-4'>
          <RelatedProducts
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
          />
        </div>
      </div>

      {/* Size Guide Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}>
          <div className='rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto' style={{ background: '#0f0f11', border: '1px solid rgba(249,115,22,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.8)' }}>
            <div className='p-5 flex items-center justify-between' style={{ borderBottom: '1px solid rgba(249,115,22,0.15)' }}>
              <h3 className='ragged-title text-xl' style={{ fontSize: '1.3rem' }}>Size Guide</h3>
              <button
                onClick={closeModal}
                className='p-2 rounded-lg transition-colors text-slate-700 hover:text-orange-400'
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='p-6'>
              <img src={assets.product_size} alt='Size guide' className='w-full h-auto rounded-xl' />
            </div>
          </div>
        </div>
      )}

      {/* Review Images Modal */}
      {isModalOpenOne && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}>
          <div className='rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden' style={{ background: '#0f0f11', border: '1px solid rgba(249,115,22,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.9)' }}>
            <div className='p-4 flex items-center justify-between' style={{ borderBottom: '1px solid rgba(249,115,22,0.15)' }}>
              <h3 className='ragged-title text-lg' style={{ fontSize: '1.1rem' }}>Customer Reviews</h3>
              <button
                onClick={closeModalOne}
                className='p-2 rounded-lg transition-colors text-slate-700 hover:text-orange-400'
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
                      className='w-full h-auto max-h-[70vh] object-contain rounded-xl'
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
    <div className='min-h-screen flex items-center justify-center ragged-section'>
      <div className='text-center space-y-5 px-6'>
        <div className='ragged-title' style={{ fontSize: 'clamp(4rem,15vw,8rem)', lineHeight: 1, color: 'rgba(249,115,22,0.25)' }}>404</div>
        <h1 className='ragged-title' style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)' }}>Product Not Found</h1>
        <p className='text-slate-500 max-w-md mx-auto text-sm leading-relaxed'>
          The product you're looking for doesn't exist or has been removed.
          Please check the URL and try again.
        </p>
        <Link to='/collection'>
          <button className='ragged-solid-btn px-8 py-3 font-bold text-sm uppercase tracking-widest mt-2'>
            Browse Products
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Product
