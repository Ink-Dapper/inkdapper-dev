import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Footer = () => {
  const { scrollToTop } = useContext(ShopContext)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <>
      {/* Modern Full-Width Map Section */}
      {!isLoginPage && (
        <section className="w-full flex flex-col items-center justify-center pt-10 pb-0 bg-transparent">
          {/* Animated Pin above the card */}
          <div className="flex flex-col items-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 via-orange-500 to-slate-800 rounded-full flex items-center justify-center shadow-lg animate-bounce relative">
              <span className="absolute w-16 h-16 bg-orange-400/40 rounded-full blur-2xl animate-pulse -z-10"></span>
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.02 11.54 7.32 11.79.41.34.95.34 1.36 0C13.98 22.54 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 13.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" />
              </svg>
            </div>
          </div>
          {/* Full-Width Card Container */}
          <div className="w-full max-w-none rounded-2xl shadow-2xl px-4 md:px-6 py-8 flex flex-col items-center bg-gradient-to-br from-orange-500 via-orange-600 to-slate-800 text-white">
            {/* Heading with accent bar */}
            <div className="flex flex-col items-center mb-2">
              <span className="block w-10 h-1 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-slate-800 mb-2"></span>
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1">Visit Our Store</h2>
            </div>
            <p className="text-white/80 text-center mb-6 max-w-lg">
              We love to meet our customers! Drop by our HQ or find us on the map below. Experience the Ink Dapper vibe in person.
            </p>
            {/* Full-Width Map Embed */}
            <div className="w-full rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Ink Dapper Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d243.07177178382534!2d78.9224971!3d12.8981809!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad09f21a377d93%3A0xe92469a07eeff7df!2sInk%20Dapper!5e0!3m2!1sen!2sin!4v1753385910137!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[220px] md:h-[450px] border-none"
              ></iframe>
            </div>

            {/* Address Details Section */}
            <div className="w-full mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col md:flex-row justify-center md:justify-start md:items-start md:items-center gap-4 md:gap-6">
                  {/* Location Icon */}
                  <div className="flex-shrink-0 flex justify-center md:justify-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                  </div>

                  {/* Address Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Ink Dapper Store</h3>
                    <div className="space-y-1 text-gray-100">
                      <a
                        href="https://maps.app.goo.gl/tY2PaHrWY7hsLT3a6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm md:text-base hover:text-orange-300 transition-colors duration-300 cursor-pointer"
                      >
                        1D, Bazaar Street
                        Vettuvanam, Vellore - 635809
                        Tamil Nadu, India
                      </a>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-shrink-0 text-center md:text-right">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center md:justify-end gap-2">
                        <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        <a
                          href="tel:+919994005696"
                          className="text-sm md:text-base text-gray-100 hover:text-orange-300 transition-colors duration-300 cursor-pointer"
                        >
                          +91 9994005696
                        </a>
                      </div>
                      <div className="flex items-center justify-center md:justify-end gap-2">
                        <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        <a
                          href="mailto:support@inkdapper.com"
                          className="text-sm md:text-base text-gray-100 hover:text-orange-300 transition-colors duration-300 cursor-pointer"
                        >
                          support@inkdapper.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Business Hours</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                    <div className="text-sm text-gray-100 text-center md:text-left">
                      <span className="font-medium text-orange-300">Mon - Sat:</span> 10:00 AM - 8:00 PM
                    </div>
                    <div className="text-sm text-gray-100 text-center md:text-left">
                      <span className="font-medium text-orange-300">Sunday:</span> 11:00 AM - 6:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:grid grid-cols-[3fr_1fr_1fr] gap-6 md:gap-14 my-8 md:my-10 mt-12 md:mt-20 text-sm max-w-7xl mx-auto">
          {/* Company Info Section */}
          <div className="order-1 md:order-1">
            <div className='mb-4'>
              <Link to='/' className='inline-flex items-center mb-3 gap-2' onClick={() => scrollToTop()}>
                <img src={assets.inkdapper_logo} alt="logo" className='w-8 h-8 md:w-16 md:h-16' />
                <p className='text-lg md:text-3xl font-medium'><span className='font-light'>Ink</span> Dapper</p>
              </Link>
            </div>
            <p className='w-full md:w-2/3 text-slate-600 text-sm md:text-base leading-relaxed'>
              Explore our collection of custom t-shirts, oversized tees, hoodies, and sweatshirts which are designed for style, comfort, and self-expression. Whether you're looking to stand out or keep it casual, Ink Dapper has something for your every vibe.
            </p>
          </div>

          {/* Company Links Section */}
          <div className="order-2 md:order-2">
            <p className='text-base md:text-xl font-medium mb-3 md:mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-slate-600'>
              <Link onClick={() => scrollToTop()} to='/' className='hover:text-orange-600 transition-colors duration-200'>
                <li className="text-sm md:text-base">Home</li>
              </Link>
              <Link onClick={() => scrollToTop()} to='/about' className='hover:text-orange-600 transition-colors duration-200'>
                <li className="text-sm md:text-base">About Us</li>
              </Link>
              <Link onClick={() => scrollToTop()} to='/shipping-and-delivery' className='hover:text-orange-600 transition-colors duration-200'>
                <li className="text-sm md:text-base">Shipping & Delivery</li>
              </Link>
              <Link onClick={() => scrollToTop()} to='/privacy-policy' className='hover:text-orange-600 transition-colors duration-200'>
                <li className="text-sm md:text-base">Privacy Policy</li>
              </Link>
              <Link onClick={() => scrollToTop()} to='/terms-and-conditions' className='hover:text-orange-600 transition-colors duration-200'>
                <li className="text-sm md:text-base">Terms & Conditions</li>
              </Link>
              <Link onClick={() => scrollToTop()} to='/cancellation-and-refund' className='hover:text-orange-600 transition-colors duration-200'>
                <li className="text-sm md:text-base">Cancellation & Refund</li>
              </Link>
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div className="order-3 md:order-3">
            <p className='text-base md:text-xl font-medium mb-3 md:mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-slate-600 mb-6'>
              <li className="text-sm md:text-base">
                <a href="tel:9994005696" className='hover:text-orange-600 transition-colors duration-200'>
                  Phone: <span className="font-semibold">+91 9994005696</span>
                </a>
              </li>
              <li className="text-sm md:text-base">
                <a href="mailto:support@inkdapper.com" className='hover:text-orange-600 transition-colors duration-200'>
                  Email: <span className="font-semibold">support@inkdapper.com</span>
                </a>
              </li>
              <li className="text-sm md:text-base">
                <Link to="/chatbot" className='hover:text-orange-600 transition-colors duration-200'>
                  Live Chat: <span className="font-semibold">Chat with us</span>
                </Link>
              </li>
            </ul>

            <div className='mt-4'>
              <p className='text-base md:text-xl font-medium mb-3 md:mb-5'>FOLLOW US</p>
              <div className='flex gap-4 md:gap-8'>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61578085829726"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-slate-600 hover:text-orange-600 transition-colors duration-300 p-1'
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com/InkDapper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-slate-600 hover:text-orange-600 transition-colors duration-300 p-1'
                  aria-label="X (Twitter)"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ink_dapper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-slate-600 hover:text-orange-600 transition-colors duration-300 p-1'
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919994005696"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-slate-600 hover:text-orange-600 transition-colors duration-300 p-1'
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full mb-8 md:mb-0 px-4 sm:px-6 lg:px-8'>
        <hr className="border-gray-200" />
        <div className="py-6 md:py-8 text-center bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg mx-2 md:mx-0 border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center space-y-2">
            {/* Brand accent line */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>

            {/* Copyright text with better mobile typography */}
            <p className='text-xs sm:text-sm text-gray-700 leading-relaxed px-4'>
              <span className="font-medium text-gray-800">Copyright 2024 - {new Date().getFullYear()}</span>
              <br className="sm:hidden" />
              <span className="sm:mx-1">©</span>
              <a
                href="https://www.inkdapper.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors duration-200 underline decoration-1 underline-offset-2"
              >
                www.inkdapper.com
              </a>
              <br className="sm:hidden" />
              <span className="sm:ml-1 text-gray-600">- All Rights Reserved</span>
            </p>

            {/* Additional mobile-friendly elements */}
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Shopping</span>
              </span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Trusted Brand</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer