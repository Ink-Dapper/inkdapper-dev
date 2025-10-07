import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  const navigate = useNavigate()

  const handlePolicyClick = () => {
    navigate('/privacy-policy')
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="our-policy-section relative py-8 md:py-24 overflow-hidden">
      {/* Modern Background with decorative elements */}
      <div className="absolute inset-0"></div>
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Our Commitment
            </span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-slate-900 bg-clip-text text-transparent">
              Why Choose Ink Dapper?
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience, from quality products to exceptional service.
          </p>
        </div>

        {/* Modern Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {/* Exchange Policy Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group-hover:bg-white/90">
              {/* Icon Container */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Main icon background */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                    <img
                      src={assets.exchange_icon}
                      alt="Exchange Policy"
                      className="w-10 h-10 md:w-12 md:h-12 object-contain filter brightness-0 invert"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 border-2 border-orange-300/30 rounded-2xl animate-pulse"></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                  Easy Exchange Policy
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  We offer hassle-free exchange policy with no questions asked. Your satisfaction is our priority.
                </p>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          </div>

          {/* Return Policy Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group-hover:bg-white/90">
              {/* Icon Container */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Main icon background */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                    <img
                      src={assets.quality_icon}
                      alt="Return Policy"
                      className="w-10 h-10 md:w-12 md:h-12 object-contain filter brightness-0 invert"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 border-2 border-amber-300/30 rounded-2xl animate-pulse animation-delay-1000"></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors duration-300">
                  7 Days Return Policy
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  We provide 7 days free return policy with full refund guarantee. Shop with confidence.
                </p>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          </div>

          {/* Customer Support Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group-hover:bg-white/90">
              {/* Icon Container */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Main icon background */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                    <img
                      src={assets.support_img}
                      alt="Customer Support"
                      className="w-10 h-10 md:w-12 md:h-12 object-contain filter brightness-0 invert"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 border-2 border-orange-300/30 rounded-2xl animate-pulse animation-delay-2000"></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">
                  Best Customer Support
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  We provide 24/7 customer support service to ensure you always get the help you need.
                </p>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <div
            onClick={handlePolicyClick}
            className="relative z-10 flex items-center gap-3 group relative inline-flex items-center justify-center px-4 py-4 md:px-10 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/30 transform hover:scale-105 border border-orange-400/50 cursor-pointer"
          >
            <span className="text-lg md:text-xl text-white font-semibold">Learn More About Our Policies</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurPolicy