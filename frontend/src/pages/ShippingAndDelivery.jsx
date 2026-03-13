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

const InfoBox = ({ children }) => (
  <div className="rounded-xl p-4 lg:p-5"
    style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
    {children}
  </div>
)

const ShippingAndDelivery = () => {
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
            Shipping & Delivery
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Fast, reliable shipping to bring your <span className="text-orange-400 font-semibold">Ink Dapper</span> products right to your doorstep.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5 lg:gap-6">

          <Section
            title="Order Processing"
            accentColor="#22c55e"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p>All orders are processed within <span className="text-green-400 font-semibold">2 to 3 business days</span> (excluding weekends and holidays) after payment confirmation.</p>
            <p>Custom and personalized orders may require additional processing time. Customers will be notified of any delays.</p>
          </Section>

          <Section
            title="Shipping Methods & Delivery Time"
            accentColor="#f97316"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p>We offer multiple shipping options, including standard and express delivery.</p>
            <InfoBox>
              <p className="text-slate-300 font-semibold text-sm mb-3">Estimated Delivery Times:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300 font-semibold text-sm">Standard Shipping</p>
                    <p className="text-slate-500 text-xs">5 to 7 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300 font-semibold text-sm">Express Shipping</p>
                    <p className="text-slate-500 text-xs">3 to 5 business days</p>
                  </div>
                </div>
              </div>
            </InfoBox>
            <p>International orders may take longer due to customs clearance and local postal service delays.</p>
          </Section>

          <Section
            title="Shipping Costs"
            accentColor="#a855f7"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
          >
            <p>Shipping charges are calculated at checkout based on the shipping destination and chosen delivery method.</p>
            <InfoBox>
              <p className="text-center text-slate-300 font-semibold text-sm sm:text-base">
                Free shipping available for orders over{' '}
                <span className="text-orange-400 text-lg font-bold">₹999</span>
              </p>
            </InfoBox>
          </Section>

          <Section
            title="Order Tracking"
            accentColor="#f97316"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" /></svg>}
          >
            <p>Once an order is shipped, customers will receive a <span className="text-orange-400 font-semibold">tracking number via email</span>.</p>
            <p>Customers can track their order through the provided tracking link.</p>
          </Section>

          <Section
            title="Shipping Restrictions"
            accentColor="#ef4444"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
          >
            <p>We currently ship to <span className="text-orange-400 font-semibold">India only</span>. If your location is not listed, please contact us before placing an order.</p>
            <InfoBox>
              <p className="text-slate-400 text-sm">We do not ship to <span className="text-red-400 font-semibold">P.O. Boxes, APO/FPO addresses</span>, or restricted areas.</p>
            </InfoBox>
          </Section>

          <Section
            title="Customs, Duties & Taxes"
            accentColor="#f59e0b"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          >
            <p>International customers are responsible for any customs duties, import taxes, or other fees imposed by their country's customs regulations.</p>
            <p>Ink Dapper is not responsible for delays due to customs clearance procedures.</p>
          </Section>

          <Section
            title="Lost or Delayed Shipments"
            accentColor="#6366f1"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p>If your order is delayed beyond the estimated delivery timeframe, please contact the shipping carrier first. If the issue persists, contact us for assistance.</p>
            <p>Ink Dapper is not responsible for lost packages due to incorrect shipping addresses provided by the customer.</p>
          </Section>

          <Section
            title="Undeliverable or Returned Packages"
            accentColor="#ec4899"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>}
          >
            <p>If a package is returned due to an incorrect address, unclaimed delivery, or refusal, customers may be responsible for additional shipping fees to resend the package.</p>
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
              Need Help?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mb-6">
              Have questions about shipping? We're here to help!
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
              <p className="text-slate-500 text-sm tracking-wide">Ink Dapper — Your Style, Your Delivery.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ShippingAndDelivery
