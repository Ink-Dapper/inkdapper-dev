import React, { useContext, useEffect, useState, useRef } from 'react';
import { FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { Flip, toast } from "react-toastify";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { assets } from '../assets/assets';
import ListReviews from '../components/ListReviews';
import ProductReviewSection from '../components/ProductReviewSection';
import RelatedProducts from '../components/RelatedProducts';
import { ShopContext } from '../context/ShopContext';
import '../styles/swiper-custom.css';

const Product = () => {

  const { productId } = useParams()
  const { products, currency, addToCart, token, getCartCount, addToWishlist, getWishlistCount, reviewList, scrollToTop } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [buyNow, setBuyNow] = useState('hidden')
  const [wishlistCta, setWishlistCta] = useState('hidden')
  const [wishlistCount, setWishlistCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0)
  const [averageRating, setAverageRating] = useState(0);
  const [changeText, setChangeText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isModalOpenOne, setIsModalOpenOne] = useState(false); // State for modal visibility
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for current image index
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle description
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ left: '0', bottom: '12' });

  useEffect(() => {
    const fetchCounts = async () => {
      const wishlistCount = await getWishlistCount();
      setWishlistCount(wishlistCount);
    }
    fetchCounts();
  }, [getWishlistCount]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null
      }
    })
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
      addToCart(productData._id, size)
      console.log(addToCart(productData._id, size))
      toast.success(`One Item Is Added To Cart`, {
        autoClose: 1000, pauseOnHover: false,
        transition: Flip
      })

      if (getCartCount() >= 0) {
        setBuyNow('block')
      }
    }
  }

  const addToWishlistPage = () => {
    if (!token) {
      toast.error('Please login to add product to cart', { autoClose: 1000, })
    } else {
      addToWishlist(productData._id)

      if (wishlistCount >= 0) {
        setWishlistCta('block')
      }
    }
  }

  const createNew = () => {
    const subCategoryMap = {
      'Customtshirt': 'Custom T-shirt',
      'Oversizedtshirt': 'Oversized T-shirt',
      'Quotesdesigns': 'Quotes Designs',
      'Plaintshirt': 'Plain T-shirt',
      'Acidwash': 'Acid Wash',
      // 'Polotshirt': 'Polo T-shirt',
      // 'Hoddies': 'Hoodies', // Fixed spelling
      // 'Sweattshirts': 'Sweat T-shirt' // Fixed spelling
    };

    // Use the mapping object to set the change text
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

    // Calculate if we're close to right edge
    const rect = e.currentTarget.getBoundingClientRect();
    const isNearRightEdge = window.innerWidth - rect.right < 180;

    // Set position based on edge proximity
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

    const productUrl = `${window.location.origin}/product/${productId}`;
    const shareText = `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}\n${productUrl}`;

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
    const productUrl = `${window.location.origin}/product/${productId}`;
    navigator.clipboard.writeText(productUrl);

    toast.info('Link copied! Open Instagram and paste in your story or message', { autoClose: 3000 });
    setShowShareMenu(false);
  };

  const shareViaMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = `${window.location.origin}/product/${productId}`;
    const shareText = `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}\n${productUrl}`;

    // On mobile, this will open the native share dialog if supported
    if (navigator.share) {
      navigator.share({
        title: productData.name,
        text: `Check out this amazing product: ${productData.name} - ${currency} ${productData.price}`,
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

  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchProductData()
    getProductReviewCount()
    createNew();
    console.log(products)
  }, [productId, products, size, getCartCount, getWishlistCount, reviewList])

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

  return productData ? (
    <div className='border-t-2 pt-6 md:pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data */}
      <div className='flex gap-5 md:gap-12 sm:gap-12 flex-col md:flex-row'>

        {/* product image */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row w-[100%] sm:w-[605px]'>
          <div className='w-full md:w-[20%] h-[100%] flex flex-col'>
            {/* Swiper for the big image */}
            <div className='w-full h-full block sm:hidden relative'>
              <Swiper
                modules={[Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className='w-full h-full'
                onSwiper={setMainSwiper}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.activeIndex);
                  setImage(productData.image[swiper.activeIndex]);
                }}
              >
                {productData.image.map((item, index) => (
                  <SwiperSlide key={index} className='relative'>
                    <img
                      src={item} // Use the individual image from the array
                      alt={`${productData.name} - view ${index + 1}`}
                      className='w-full h-full object-contain shadow-lg'
                    />
                  </SwiperSlide>
                ))}

                {/* Share button */}
                <div className="absolute left-3 bottom-3 z-10">
                  <button
                    onClick={(e) => handleShareButtonClick(e)}
                    className="bg-white bg-opacity-70 rounded-full p-1.5 shadow-md hover:bg-opacity-100 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                    </svg>
                  </button>

                  {/* Share menu popup */}
                  {showShareMenu && (
                    <div
                      ref={shareMenuRef}
                      className="absolute -left-1 !bottom-9 bg-white rounded-md shadow-lg p-2 z-30"
                      style={{
                        maxWidth: '180px',
                        left: popupPosition.left === 'auto' ? 'auto' : '0',
                        right: popupPosition.right,
                        bottom: `${popupPosition.bottom}px`,
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={(e) => shareOnWhatsApp(e)}
                          className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded w-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#555">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </button>

                        <button
                          onClick={(e) => shareOnInstagram(e)}
                          className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded w-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
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
                          className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded w-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#555">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Swiper>
            </div>

            {/* Swiper for the small images (thumbnails) */}
            <div className='block sm:hidden mt-4'>
              <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={3}
                navigation
                className='w-full h-full'
              >
                {productData.image.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className={`p-1 ${activeIndex === index ? 'border-2 border-orange-500' : ''}`}>
                      <img
                        onClick={() => {
                          setImage(item);
                          setActiveIndex(index);
                          if (mainSwiper) mainSwiper.slideTo(index);
                        }}
                        src={item}
                        alt={`${productData.name} thumbnail ${index + 1}`}
                        className='w-full h-auto cursor-pointer shadow-lg'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Original layout for larger screens */}
            <div className='hidden sm:flex gap-0 md:gap-0 ml-0 sm:flex-col md:overflow-x-auto sm:overflow-y-scroll justify-between w-[100%] h-[100%]'>
              {productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  alt="product-thumbnail"
                  className='w-[22%] h-[24%] md:w-[100%] md:h-[24%] flex-shrink-0 cursor-pointer shadow-lg'
                />
              ))}
            </div>
          </div>
          <div className='w-[100%] md:w-[80%] h-[100%] flex justify-center hidden sm:block relative'>
            <img src={image} className='h-[100%] w-auto object-contain shadow-lg' alt="product-image" />

            {/* Share button */}
            <div className="absolute left-3 bottom-3 z-10">
              <button
                onClick={(e) => handleShareButtonClick(e)}
                className="bg-white bg-opacity-70 rounded-full p-1.5 shadow-md hover:bg-opacity-100 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
              </button>

              {/* Share menu popup */}
              {showShareMenu && (
                <div
                  ref={shareMenuRef}
                  className="absolute -left-1 !bottom-9 bg-white rounded-md shadow-lg p-2 z-30"
                  style={{
                    maxWidth: '180px',
                    left: popupPosition.left === 'auto' ? 'auto' : '0',
                    right: popupPosition.right,
                    bottom: `${popupPosition.bottom}px`,
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => shareOnWhatsApp(e)}
                      className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#555">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => shareOnInstagram(e)}
                      className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
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
                      className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#555">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* product-info */}
        <div className='flex-1'>
          <h1 className='font-medium text-xl md:text-2xl lg:text-3xl'>{productData.name}</h1>
          <p className='text-gray-500 mt-1 text-sm md:text-base md:mt-2'>{changeText}</p>
          <div className='relative'>
            <div className='flex items-center gap-1 mt-2 absolute -top-0 right-0 md:static'>
              {stars.map((starValue) => (
                <FaStar
                  key={starValue}
                  className={`cursor-pointer md:static ${averageRating >= starValue ? 'text-red-500' : 'text-gray-300'}`}
                  size={15}
                />
              ))}
              <p className='pl-2'>( {reviewCount} )</p>
            </div>
          </div>
          <div className='flex items-center gap-6'>
            {
              productData.beforePrice && <p className='mt-2 md:mt-3 lg:mt-5 text-lg md:text-xl lg:text-2xl text-gray-500 font-medium relative'>
                <span className='w-12 md:w-16 lg:w-20 h-[1.5px] bg-red-500 absolute top-3 lg:top-4 -right-1 lg:-right-3 -rotate-12'></span>{currency} {productData.beforePrice}
              </p>
            }
            <p className='mt-2 md:mt-3 lg:mt-5 text-xl md:text-2xl lg:text-3xl font-medium'>{currency} {productData.price}</p>
          </div>
          <p
            className={`mt-2 lg:mt-3 text-sm text-gray-500 w-4/5 ${isExpanded ? '' : 'line-clamp-2'
              }`}
          >
            {productData.description}
          </p>
          {productData.description.length > 60 && ( // Show arrow buttons only if description is long
            <button
              onClick={toggleDescription}
              className="text-gray-400 mt-0 text-sm flex items-center gap-1"
            >
              {isExpanded ? (
                <span className="text-orange-600 mt-0 text-sm flex items-center gap-1">
                  Read less...
                </span>
              ) : (
                <span className="text-orange-600 mt-0 text-sm flex items-center gap-1">
                  Read more...
                </span>
              )}
            </button>
          )}
          <div className='flex flex-col gap-4 my-1 md:mt-2 lg:mt-2 md:mb-1'>
            <p>Select size</p>
            <div className='flex gap-2'>
              {
                productData.sizes.map((item, index) => {
                  return (
                    <button onClick={() => setSize(item)} key={index} className={`border text-sm md:text-base py-2 px-3 md:py-1 md:px-2 lg:py-2 lg:px-4 bg-gray-100 gap-4 ${item == size ? 'border-orange-500' : ''}`}>{item}</button>
                  )
                })
              }
            </div>
            <div className=''>
              <button className='text-sm md:text-base text-gray-500 border-b-2 border-gray-500' onClick={() => setIsModalOpen(true)}>Size Guide</button>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-wrap gap-2 mt-2 md:mt-4'>
              <button onClick={() => addCartPageDetails()} className='bg-black text-white px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700'>ADD TO CART</button>
              <Link to='/cart'>
                <button onClick={scrollToTop} className={`bg-black text-white  px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700 ${buyNow}`}>BUY NOW</button>
              </Link>
            </div>
            <div className='flex flex-wrap gap-2'>
              <button onClick={() => addToWishlistPage()} className={`bg-black text-white px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700`}>ADD TO WISHLIST</button>
              <Link to='/wishlist'>
                <button className={`bg-black text-white px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm active:bg-gray-700 ${wishlistCta}`}>WISHLIST</button>
              </Link>
            </div>
          </div>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p className='text-green-600 font-semibold'>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      {/* --------------Review Images------------------ */}
      {productData.reviewImage.length > 0 ? <h3 className='font-medium text-lg mt-8 mb-1'>Review Images</h3> : ''}

      <div className='gap-4 flex'>
        {
          productData.reviewImage.map((item, index) => (
            <div className='mt-1 md:mt-5' key={index}>
              <div className='flex flex-col gap-4'>
                <img src={item} alt="product-image" className='w-32 h-40 md:w-40 md:h-48 object-contain cursor-pointer' onClick={() => openModalOne(index)} />
              </div>
            </div>
          ))
        }
      </div>

      <div className='flex flex-col lg:flex lg:flex-row w-auto justify-between items-start lg:items-center'>
        {/* -------------User Reviews-------------- */}
        <ProductReviewSection productId={productData._id} className="w-1/2" />

        {/* -------------User Reviews-------------- */}
        <ListReviews className="w-1/2" />
      </div>

      {/* ----------Display related products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

      {/* Modal Component */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center'>
          <div className='bg-white p-4 rounded relative'>
            <button onClick={closeModal} className='absolute top-2 right-4 px-2 bg-gray-500 text-white'>X</button>
            <img src={assets.product_size} alt='product-image' className='mt-6' />
          </div>
        </div>
      )}

      {/* Popup Modal with Swiper for Mobile */}
      {isModalOpenOne && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center'>
          <div className='bg-white p-4 pt-10 rounded w-[95%] sm:w-[500px] relative'>
            <button
              onClick={closeModalOne}
              className='absolute top-2 right-4 px-2 py-[0.1rem] bg-gray-500 text-white rounded-full'
            >
              X
            </button>
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className='w-full h-auto'
              initialSlide={currentImageIndex} // Start with the selected image
              onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)} // Update the current index
            >
              {productData.reviewImage.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={item}
                    alt="product-image"
                    className='w-full h-auto object-contain'
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  ) : <div className='text-6xl font-semibold text-gray-400 flex items-center justify-center text-center pt-20'>Product Not Available<br /> Sorry!</div>
}

export default Product
