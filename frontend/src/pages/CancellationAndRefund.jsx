import React from 'react'

const CancellationAndRefund = () => {
  return (
    <div className="min-h-screen">
      <div className="w-full py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 bg-clip-text text-transparent mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Understanding our cancellation and refund policies for Ink Dapper products
          </p>
          <p className="text-lg text-gray-500 mt-2">Last Updated: 20-02-2025</p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Order Cancellation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Order Cancellation</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Customers can cancel their order <span className="font-semibold text-red-600">before the product is shipped</span>. After this period, cancellations may not be possible as processing begins immediately.
                </p>
                <p className="text-base lg:text-lg leading-relaxed">
                  To request a cancellation, contact us at <a href="mailto:support@inkdapper.com" className="text-orange-600 hover:text-orange-700 font-semibold">support@inkdapper.com</a> with your order details.
                </p>
                <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-xl p-4 lg:p-6 border border-green-200">
                  <p className="text-base lg:text-lg leading-relaxed">
                    If your cancellation is approved, the full amount will be refunded to your original payment method within <span className="font-semibold text-green-600">3 to 5 business days</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Refund Policy</h2>
              </div>
              <div className="space-y-6">
                <p className="text-base lg:text-lg text-gray-700">
                  We aim for 100% customer satisfaction. Our refund policy applies under the following conditions:
                </p>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 lg:p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">a) Customized Products:</h3>
                  <p className="text-base lg:text-lg leading-relaxed text-gray-700">
                    Due to the nature of personalized items, customized t-shirts and embroidered products are <span className="font-semibold text-red-600">non-refundable</span> unless they are defective or incorrect.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 lg:p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">b) Non-Customized Products:</h3>
                  <p className="text-base lg:text-lg leading-relaxed text-gray-700 mb-2">
                    You may request a return or refund for defective or incorrect items.
                  </p>
                  <p className="text-base lg:text-lg leading-relaxed text-gray-700 mb-2">
                    Contact us within <span className="font-semibold text-green-600">2 to 3 days</span> of receiving your order with proof (photos/videos) of the issue.
                  </p>
                  <p className="text-base lg:text-lg leading-relaxed text-gray-700">
                    Once approved, we will process your refund or send a replacement.
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Processing Time */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Refund Processing Time</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">
                  Approved refunds will be processed within <span className="font-semibold text-blue-600">3 to 5 business days</span> after receiving the returned item (if applicable).
                </p>
                <p className="text-base lg:text-lg leading-relaxed">
                  The refund will be credited to your original payment method. Processing times may vary based on your bank or payment provider.
                </p>
              </div>
            </div>

            {/* Shipping Fees */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Shipping Fees</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-red-200">
                  <p className="text-base lg:text-lg leading-relaxed">
                    <span className="font-semibold text-red-600">Shipping fees are non-refundable,</span> except in cases where the return is due to an error on our part (e.g., wrong item shipped or a defective product).
                  </p>
                </div>
                <p className="text-base lg:text-lg leading-relaxed">
                  Customers are responsible for return shipping costs unless the item is defective.
                </p>
              </div>
            </div>

            {/* Non-Refundable Situations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl mr-4 shadow-lg flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Non-Refundable Situations</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-base lg:text-lg leading-relaxed">We do not offer refunds for:</p>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 lg:p-6 border border-red-200">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-base lg:text-lg leading-relaxed">Customized or personalized items unless they are defective.</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-base lg:text-lg leading-relaxed">Orders canceled after <span className="font-semibold text-red-600">24 hours</span> of purchase.</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-base lg:text-lg leading-relaxed">Items returned without prior approval.</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-base lg:text-lg leading-relaxed">Products damaged due to customer misuse.</p>
                    </div>
                  </div>
                </div>
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
                Have questions about our cancellation and refund policy? We're here to help!
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

export default CancellationAndRefund