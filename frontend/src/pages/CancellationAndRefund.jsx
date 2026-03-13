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
    <div className="space-y-4 text-slate-400 text-sm sm:text-base leading-relaxed">
      {children}
    </div>
  </div>
)

const InfoBox = ({ children, variant = 'default' }) => {
  const styles = {
    default: { background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' },
    danger: { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' },
    success: { background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' },
  }
  return (
    <div className="rounded-xl p-4 lg:p-5" style={styles[variant]}>
      {children}
    </div>
  )
}

const Bullet = ({ children, color = 'bg-red-500' }) => (
  <div className="flex items-start gap-3">
    <div className={`w-1.5 h-1.5 rounded-full ${color} mt-2 flex-shrink-0`} />
    <p className="text-sm sm:text-base leading-relaxed text-slate-400">{children}</p>
  </div>
)

const CancellationAndRefund = () => {
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
          <h1 className="ragged-title mb-4" style={{ fontSize: 'clamp(1.8rem, 6vw, 4rem)' }}>
            Cancellation & Refund
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mb-3">Last Updated: 20-02-2025</p>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Understanding our cancellation and refund policies for <span className="text-orange-400 font-semibold">Ink Dapper</span> products.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5 lg:gap-6">

          <Section
            title="Order Cancellation"
            accentColor="#ef4444"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          >
            <p>
              Customers can cancel their order <span className="text-red-400 font-semibold">before the product is shipped</span>. After this period, cancellations may not be possible as processing begins immediately.
            </p>
            <p>
              To request a cancellation, contact us at{' '}
              <a href="mailto:support@inkdapper.com" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                support@inkdapper.com
              </a>{' '}
              with your order details.
            </p>
            <InfoBox variant="success">
              <p>If your cancellation is approved, the full amount will be refunded to your original payment method within <span className="text-green-400 font-semibold">3 to 5 business days</span>.</p>
            </InfoBox>
          </Section>

          <Section
            title="Refund Policy"
            accentColor="#22c55e"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
          >
            <p>We aim for 100% customer satisfaction. Our refund policy applies under the following conditions:</p>

            <InfoBox variant="danger">
              <p className="text-slate-300 font-semibold text-sm mb-2">a) Customized Products</p>
              <p className="text-slate-400 text-sm">Due to the nature of personalized items, customized t-shirts and embroidered products are <span className="text-red-400 font-semibold">non-refundable</span> unless they are defective or incorrect.</p>
            </InfoBox>

            <InfoBox variant="success">
              <p className="text-slate-300 font-semibold text-sm mb-2">b) Non-Customized Products</p>
              <p className="text-slate-400 text-sm mb-2">You may request a return or refund for defective or incorrect items.</p>
              <p className="text-slate-400 text-sm mb-2">Contact us within <span className="text-green-400 font-semibold">2 to 3 days</span> of receiving your order with proof (photos/videos) of the issue.</p>
              <p className="text-slate-400 text-sm">Once approved, we will process your refund or send a replacement.</p>
            </InfoBox>
          </Section>

          <Section
            title="Refund Processing Time"
            accentColor="#0ea5e9"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p>
              Approved refunds will be processed within <span className="text-blue-400 font-semibold">3 to 5 business days</span> after receiving the returned item (if applicable).
            </p>
            <p>
              The refund will be credited to your original payment method. Processing times may vary based on your bank or payment provider.
            </p>
          </Section>

          <Section
            title="Shipping Fees"
            accentColor="#a855f7"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          >
            <InfoBox variant="danger">
              <p className="text-sm"><span className="text-red-400 font-semibold">Shipping fees are non-refundable,</span> except in cases where the return is due to an error on our part (e.g., wrong item shipped or a defective product).</p>
            </InfoBox>
            <p>Customers are responsible for return shipping costs unless the item is defective.</p>
          </Section>

          <Section
            title="Non-Refundable Situations"
            accentColor="#f59e0b"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
          >
            <p>We do not offer refunds for:</p>
            <InfoBox variant="danger">
              <div className="space-y-2.5">
                <Bullet>Customized or personalized items unless they are defective.</Bullet>
                <Bullet>Orders canceled after <span className="text-red-400 font-semibold">24 hours</span> of purchase.</Bullet>
                <Bullet>Items returned without prior approval.</Bullet>
                <Bullet>Products damaged due to customer misuse.</Bullet>
              </div>
            </InfoBox>
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
              Have questions about our cancellation and refund policy? We're here to help!
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

export default CancellationAndRefund
