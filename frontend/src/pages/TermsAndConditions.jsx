import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen">
      <div className="w-full py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Last Updated: 20-02-2025
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Welcome to Ink Dapper! These Terms and Conditions govern your use of our website and services. By accessing or using <a className='text-orange-600 underline font-semibold' href="http://www.inkdapper.com">www.inkdapper.com</a>, you agree to abide by these terms.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* General Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">General Information</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Ink Dapper is an online clothing brand specializing in customized t-shirts, embroidery, and other apparel. These terms apply to all users, including browsers, customers, and vendors.
                </p>
              </div>
            </div>

            {/* Account Registration */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Account Registration</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  To place an order, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and ensuring that all information provided is accurate and up to date.
                </p>
              </div>
            </div>

            {/* Orders and Payments */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Orders and Payments</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  When you place an order, you agree to pay the specified amount for the products and services requested. Payments are processed securely through trusted payment gateways.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-purple-200">
                  <div className="space-y-3">
                    <p className="text-base lg:text-lg leading-relaxed">
                      • All orders placed through our website are subject to availability.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Prices are listed in Indian Currency (Rupee) and may be subject to change without notice.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Payments are securely processed through third-party payment providers. We do not store payment details.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Ink Dapper reserves the right to refuse or cancel any order at our discretion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customization and Design */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Customization and Design</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Customization options may vary depending on the product. You agree to provide accurate and complete information during the customization process.
                </p>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 lg:p-6 border border-orange-200">
                  <div className="space-y-3">
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Customers can customize t-shirts and apparel using our design tools.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • By submitting a design, you confirm that you have the rights to use all content provided and that it does not infringe on any intellectual property rights.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Ink Dapper reserves the right to reject or modify designs that violate our policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping and Delivery */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Shipping and Delivery</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  We aim to deliver products within the specified time frame. Shipping costs and delivery times may vary based on your location.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 lg:p-6 border border-blue-200">
                  <div className="space-y-3">
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Estimated delivery times vary based on location and order volume.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Ink Dapper is not responsible for delays caused by shipping carriers or unforeseen circumstances.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Customers are responsible for providing accurate shipping information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns and Refunds */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Returns and Refunds</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  We want you to be satisfied with your purchase. If you are not happy with your order, please contact us within 7 days of receiving your items.
                </p>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-red-200">
                  <div className="space-y-3">
                    <p className="text-base lg:text-lg leading-relaxed">
                      • We accept returns only for defective or incorrect items. Customized products are non-refundable unless there is a manufacturing defect.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Customers must contact us within 7 days of receiving an order to request a return or replacement.
                    </p>
                    <p className="text-base lg:text-lg leading-relaxed">
                      • Refunds, if applicable, will be processed within 3 to 5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  All content on the Ink Dapper website, including logos, designs, and images, is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our permission.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Ink Dapper is not liable for any damages, losses, or claims arising from the use of our website or services. We are not responsible for any indirect, incidental, or consequential damages.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Governing Law</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  These Terms and Conditions are governed by the laws of India. Any disputes or claims arising from these terms will be subject to the jurisdiction of the courts in Vellore, Tamilnadu.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Changes to Terms</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Ink Dapper reserves the right to update or modify these Terms and Conditions at any time. By continuing to use our website, you agree to the revised terms. We recommend reviewing these terms periodically for any changes.
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
                If you have any questions or concerns about our Terms and Conditions, please contact us:
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:support@inkdapper.com" className="text-base lg:text-lg font-semibold hover:underline">
                    support@inkdapper.com
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

export default TermsAndConditions