import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-12 lg:py-16">
        {/* About Section */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-24">
          <div className="relative group">
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img
              src={assets.about_us}
              alt="Ink Dapper Team"
              className="relative rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-700"
            />
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-600 rounded-full mr-2"></span>
              Our Story
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Fashion is more than just clothing—it's a form of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                self-expression
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              At Ink Dapper, we believe that fashion is more than just clothing—it's a form of self-expression.
              Founded with creativity at its core, we specialize in custom t-shirts, oversized tees, hoodies,
              and sweatshirts that empower you to wear your story.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Our Mission</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We're here to blur the lines between comfort and creativity. With a focus on premium quality
                    and individuality, we aim to provide clothing that's not only stylish but also feels great to wear, every day.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Our Promise</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    At Ink Dapper, each piece is crafted with care, using high-quality fabrics and thoughtful designs.
                    We value creativity, inclusivity, and sustainability, ensuring that you get products that look great,
                    long lasting, and feel good to wear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-100 text-amber-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-600 rounded-full mr-2"></span>
            Why Choose Us
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Experience the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Difference
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We don't just sell clothes—we help you express your vibe. From casual streetwear to fully customized creations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-24">
          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl"></div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Quality Assurance</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              We believe great style starts with great quality. Every piece is crafted with premium fabrics and attention to detail.
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500 rounded-full mr-2 sm:mr-3"></span>
                Soft and durable materials
              </li>
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500 rounded-full mr-2 sm:mr-3"></span>
                Vibrant prints that stay fresh
              </li>
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500 rounded-full mr-2 sm:mr-3"></span>
                Rigorous quality checks
              </li>
            </ul>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-t-2xl"></div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Convenience</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Shopping with us is simple, smooth, and stress-free, from browsing to checkout and delivery.
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full mr-2 sm:mr-3"></span>
                User-friendly online store
              </li>
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full mr-2 sm:mr-3"></span>
                Fast shipping & secure payments
              </li>
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full mr-2 sm:mr-3"></span>
                Worldwide delivery
              </li>
            </ul>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-2xl"></div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Customer Service</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              At Ink Dapper, our customer comes first. We're committed to providing responsive, friendly support.
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3"></span>
                Easy returns and exchanges
              </li>
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3"></span>
                Quick response time
              </li>
              <li className="flex items-center">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3"></span>
                Dedicated support team
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Join the Ink Dapper Movement
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Whether you want to rock personalized designs, make a bold statement, or keep it cool with timeless essentials,
            Ink Dapper offers something for every personality and style.
          </p>
          <div className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-orange-600 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors duration-300">
            <span>Elevate Your Wardrobe</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-orange-50 dark:bg-gray-800">
        <NewsLetterBox />
      </div>
    </div>
  )
}

export default About