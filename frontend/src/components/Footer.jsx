import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Footer = () => {

  const { scrollToTop } = useContext(ShopContext)

  return (
    <div>
      <div className="flex flex-col md:grid grid-cols-[3fr_1fr_1fr] gap-8 md:gap-14 my-10 mt-15 md:mt-40 text-sm">
        <div>
          <div className=''>
            <Link to='/' className='inline-flex items-center mb-2 gap-2'>
              <img src={assets.inkdapper_logo} alt="logo" className='mb-1 w-7 md:mb-5 md:w-16' />
              <p className='text-xl md:text-3xl font-medium'><span className='font-light'>Ink</span> Dapper</p>
            </Link>
          </div>
          <p className='w-full md:w-2/3 text-gray-600 text-xs md:text-base'>
            Explore our collection of custom t-shirts, oversized tees, hoodies, and sweatshirts which are designed for style, comfort, and self-expression. Whether you're looking to stand out or keep it casual, Ink Dapper has something for your every vibe.
          </p>
        </div>
        <div>
          <p className='text-lg md:text-xl font-medium md-2 md:mb-5'>COMPANY</p>
          <ul className='inline-flex flex-col gap-1 text-gray-600'>
            <Link onClick={() => scrollToTop()} to='/'>
              <li>Home</li>
            </Link>
            <Link onClick={() => scrollToTop()} to='/about'>
              <li>About Us</li>
            </Link>
            <Link onClick={() => scrollToTop()} to='/shipping-and-delivery'>
              <li>Shipping & Delivery</li>
            </Link>
            <Link onClick={() => scrollToTop()} to='/privacy-policy'>
              <li>Privacy Policy</li>
            </Link>
            <Link onClick={() => scrollToTop()} to='/terms-and-conditions'>
              <li>Terms & Conditions</li>
            </Link>
            <Link onClick={() => scrollToTop()} to='/cancellation-and-refund'>
              <li>Cancellation & Refund</li>
            </Link>
          </ul>
        </div>
        <div>
          <p className='text-lg md:text-xl font-medium md-2 md:mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li><a href="tel:9994005696">Phone : <b>+91 9994005696</b></a></li>
            <li><a href="mailto:support@inkdapper.com">Email : <b>support@inkdapper.com</b></a></li>
          </ul>
        </div>
      </div>
      <div className='w-full mb-12 md:mb-0'>
        <hr />
        <p className='py-5 text-sm text-center hidden md:block'>Copyright 2024 - {new Date().getFullYear()} © www.inkdapper.com - All Right Reserved.</p>
        <p className='py-5 text-sm text-center block md:hidden'>Copyright 2024 - {new Date().getFullYear()} © www.inkdapper.com <br /> - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer