import React, { useContext, useEffect, useState } from 'react';
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
            <div className='w-full h-full block sm:hidden'>
              <Swiper
                modules={[Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className='w-full h-full'
              >
                {productData.image.map((item, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image} // Use the selected image state
                      alt="product-image"
                      className='w-full h-full object-contain shadow-lg'
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Swiper for the small images (thumbnails) */}
            <div className='block sm:hidden mt-4'>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                className='w-full h-full'
              >
                {productData.image.map((item, index) => (
                  <SwiperSlide key={index}>
                    <img
                      onClick={() => setImage(item)} // Update the main image on click
                      src={item}
                      alt="product-thumbnail"
                      className='w-full h-auto cursor-pointer shadow-lg'
                    />
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
          <div className='w-[100%] md:w-[80%] h-[100%] md:h-[100%] flex justify-center hidden sm:block'>
            <img src={image} className='h-[100%] shadow-lg' alt="product-image" />
          </div>
        </div>

        {/* product-info */}
        <div className='flex-1'>
          <h1 className='font-medium text-xl md:text-2xl lg:text-3xl'>{productData.name}</h1>
          <p className='text-gray-500 mt-1 text-sm md:text-base md:mt-2'>{changeText}</p>
          <div className='relative'>
            <div className='flex items-center gap-1 mt-2 absolute -top-8 right-0 md:static'>
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
