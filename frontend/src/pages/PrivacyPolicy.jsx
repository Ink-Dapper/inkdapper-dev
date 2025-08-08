import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <div className="w-full py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            At Ink Dapper, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Information We Collect */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  When you use our website or make a purchase, we may collect the following types of information:
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 lg:p-6 border border-blue-200">
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Personal Information</p>
                        <p className="text-gray-600 text-sm lg:text-base">Name, email address, phone number, shipping address, and payment details</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-indigo-200 shadow-sm">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Browsing Information</p>
                        <p className="text-gray-600 text-sm lg:text-base">IP addresses, browser type, and cookies</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Transaction Details</p>
                        <p className="text-gray-600 text-sm lg:text-base">Items ordered, payment method, and delivery preferences</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  We use the information we collect to:
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 lg:p-6 border border-green-200">
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Process Orders</p>
                        <p className="text-gray-600 text-sm lg:text-base">To complete transactions and deliver your products</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-emerald-200 shadow-sm">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Improve Our Services</p>
                        <p className="text-gray-600 text-sm lg:text-base">To enhance your shopping experience and make our site more user-friendly</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Marketing</p>
                        <p className="text-gray-600 text-sm lg:text-base">To send you promotional offers, updates on new collections, and exclusive deals</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-emerald-200 shadow-sm">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Customer Support</p>
                        <p className="text-gray-600 text-sm lg:text-base">To address any inquiries, returns, or issues you may have</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sharing Your Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Sharing Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  We respect your privacy and do not sell or trade your personal information. We may share data with trusted third-party partners solely for purposes like:
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-purple-200">
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Payment Processing</p>
                        <p className="text-gray-600 text-sm lg:text-base">To securely process your transactions</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-pink-200 shadow-sm">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Shipping</p>
                        <p className="text-gray-600 text-sm lg:text-base">To ensure timely delivery of your orders</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Analytics</p>
                        <p className="text-gray-600 text-sm lg:text-base">To track site performance and enhance your experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Protecting Your Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Protecting Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  We implement strict security measures to safeguard your personal data. This includes:
                </p>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-red-200">
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200 shadow-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Encrypted Payments</p>
                        <p className="text-gray-600 text-sm lg:text-base">Secure payment gateways to protect your financial information</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-pink-200 shadow-sm">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Data Protection</p>
                        <p className="text-gray-600 text-sm lg:text-base">Regular monitoring and security protocols to prevent unauthorized access</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Your Rights</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  You have the right to:
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 lg:p-6 border border-yellow-200">
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-yellow-200 shadow-sm">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Access Your Information</p>
                        <p className="text-gray-600 text-sm lg:text-base">Request details about the personal data we hold about you</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-amber-200 shadow-sm">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Update or Correct Information</p>
                        <p className="text-gray-600 text-sm lg:text-base">Ensure your details are accurate and up to date</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-yellow-200 shadow-sm">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">Delete Your Information</p>
                        <p className="text-gray-600 text-sm lg:text-base">Request that we delete your personal data, subject to legal obligations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Cookies</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Our website uses cookies to personalize your shopping experience and track usage patterns. You can adjust your browser settings to decline cookies, but this may limit some features of the site.
                </p>
              </div>
            </div>

            {/* Changes to This Policy */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Changes to This Policy</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Ink Dapper may update this Privacy Policy periodically. Any changes will be posted on this page, and we encourage you to review it regularly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-3xl p-6 lg:p-8 xl:p-12 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-lg lg:text-xl mb-8 opacity-90">
                If you have any questions or concerns about our Privacy Policy, please contact us:
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:inkdapper@gmail.com" className="text-base lg:text-lg font-semibold hover:underline">
                    inkdapper@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                  <a href="https://www.inkdapper.com" className="text-base lg:text-lg font-semibold hover:underline">
                    www.inkdapper.com
                  </a>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-lg lg:text-xl font-semibold">
                  Ink Dapper – Your Style, Your Privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy