import React from 'react'

const Section = ({ icon, title, accentColor = '#f97316', children }) => (
  <div className="relative rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:border-orange-500/30"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.12)' }}>
    <div className="flex items-center gap-4 mb-5">
      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${accentColor}, #f59e0b)`, boxShadow: `0 0 16px ${accentColor}40` }}>
        {icon}
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#f1f5f9' }}>
        {title}
      </h2>
    </div>
    <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
      {children}
    </div>
  </div>
)

const Bullet = ({ children }) => (
  <div className="flex items-start gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
    <p className="text-sm sm:text-base leading-relaxed text-slate-400">{children}</p>
  </div>
)

const InfoBox = ({ children, accentColor = 'rgba(249,115,22,0.08)' }) => (
  <div className="rounded-xl p-4 lg:p-5 space-y-3"
    style={{ background: accentColor, border: '1px solid rgba(249,115,22,0.15)' }}>
    {children}
  </div>
)

const TermsAndConditions = () => {
  return (
    <div className="ragged-section min-h-screen" style={{ background: '#0d0d0e' }}>
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }} />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">Ink Dapper</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }} />
          </div>
          <h1 className="ragged-title mb-4" style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}>
            Terms & Conditions
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mb-3">Last Updated: 20-02-2025</p>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 leading-relaxed">
            Welcome to <span className="text-orange-400 font-semibold">Ink Dapper!</span> These Terms and Conditions govern your use of our website and services. By accessing{' '}
            <a className="text-orange-400 hover:text-orange-300 underline font-semibold transition-colors" href="http://www.inkdapper.com">www.inkdapper.com</a>,
            you agree to abide by these terms.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5 lg:gap-6">

          <Section
            title="General Information"
            accentColor="#6366f1"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p>Ink Dapper is an online clothing brand specializing in customized t-shirts, embroidery, and other apparel. These terms apply to all users, including browsers, customers, and vendors.</p>
          </Section>

          <Section
            title="Account Registration"
            accentColor="#22c55e"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          >
            <p>To place an order, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and ensuring that all information provided is accurate and up to date.</p>
          </Section>

          <Section
            title="Orders and Payments"
            accentColor="#a855f7"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
          >
            <p>When you place an order, you agree to pay the specified amount. Payments are processed securely through trusted payment gateways.</p>
            <InfoBox>
              <div className="space-y-2.5">
                <Bullet>All orders placed through our website are subject to availability.</Bullet>
                <Bullet>Prices are listed in Indian Currency (Rupee) and may be subject to change without notice.</Bullet>
                <Bullet>Payments are securely processed through third-party payment providers. We do not store payment details.</Bullet>
                <Bullet>Ink Dapper reserves the right to refuse or cancel any order at our discretion.</Bullet>
              </div>
            </InfoBox>
          </Section>

          <Section
            title="Customization and Design"
            accentColor="#f97316"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>}
          >
            <p>Customization options may vary depending on the product. You agree to provide accurate and complete information during the customization process.</p>
            <InfoBox>
              <div className="space-y-2.5">
                <Bullet>Customers can customize t-shirts and apparel using our design tools.</Bullet>
                <Bullet>By submitting a design, you confirm that you have the rights to use all content provided and that it does not infringe on any intellectual property rights.</Bullet>
                <Bullet>Ink Dapper reserves the right to reject or modify designs that violate our policies.</Bullet>
              </div>
            </InfoBox>
          </Section>

          <Section
            title="Shipping and Delivery"
            accentColor="#0ea5e9"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          >
            <p>We aim to deliver products within the specified time frame. Shipping costs and delivery times may vary based on your location.</p>
            <InfoBox>
              <div className="space-y-2.5">
                <Bullet>Estimated delivery times vary based on location and order volume.</Bullet>
                <Bullet>Ink Dapper is not responsible for delays caused by shipping carriers or unforeseen circumstances.</Bullet>
                <Bullet>Customers are responsible for providing accurate shipping information.</Bullet>
              </div>
            </InfoBox>
          </Section>

          <Section
            title="Returns and Refunds"
            accentColor="#ef4444"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>}
          >
            <p>We want you to be satisfied with your purchase. If you are not happy with your order, please contact us within <span className="text-orange-400 font-semibold">7 days</span> of receiving your items.</p>
            <InfoBox>
              <div className="space-y-2.5">
                <Bullet>We accept returns only for defective or incorrect items. Customized products are non-refundable unless there is a manufacturing defect.</Bullet>
                <Bullet>Customers must contact us within 7 days of receiving an order to request a return or replacement.</Bullet>
                <Bullet>Refunds, if applicable, will be processed within 3 to 5 business days.</Bullet>
              </div>
            </InfoBox>
          </Section>

          <Section
            title="Intellectual Property"
            accentColor="#8b5cf6"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          >
            <p>All content on the Ink Dapper website, including logos, designs, and images, is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our permission.</p>
          </Section>

          <Section
            title="Limitation of Liability"
            accentColor="#f59e0b"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
          >
            <p>Ink Dapper is not liable for any damages, losses, or claims arising from the use of our website or services. We are not responsible for any indirect, incidental, or consequential damages.</p>
          </Section>

          <Section
            title="Governing Law"
            accentColor="#10b981"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
          >
            <p>These Terms and Conditions are governed by the laws of India. Any disputes or claims arising from these terms will be subject to the jurisdiction of the courts in <span className="text-orange-400 font-semibold">Vellore, Tamilnadu</span>.</p>
          </Section>

          <Section
            title="Changes to Terms"
            accentColor="#f97316"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
          >
            <p>Ink Dapper reserves the right to update or modify these Terms and Conditions at any time. By continuing to use our website, you agree to the revised terms. We recommend reviewing these terms periodically for any changes.</p>
          </Section>
        </div>

        {/* Contact Footer */}
        <div className="mt-12 relative rounded-2xl p-8 lg:p-10 overflow-hidden"
          style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)' }}>
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)' }} />
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 24px rgba(249,115,22,0.35)' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#f1f5f9' }} className="mb-3">
              Contact Us
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mb-6">
              Questions about our Terms and Conditions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <a href="mailto:support@inkdapper.com"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                support@inkdapper.com
              </a>
              <a href="https://www.inkdapper.com"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}>
                www.inkdapper.com
              </a>
            </div>
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(249,115,22,0.15)' }}>
              <p className="text-slate-500 text-sm tracking-wide">Ink Dapper — Your Style, Your Privacy.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TermsAndConditions
