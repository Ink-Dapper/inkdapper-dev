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

const Bullet = ({ children }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.08)' }}>
    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
    <p className="text-sm sm:text-base leading-relaxed text-slate-400">{children}</p>
  </div>
)

const PrivacyPolicy = () => {
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
          <h1 className="ragged-title mb-4" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)' }}>
            Privacy Policy
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            At <span className="text-orange-400 font-semibold">Ink Dapper</span>, your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5 lg:gap-6">

          <Section
            title="Information We Collect"
            accentColor="#f97316"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          >
            <p>When you use our website or make a purchase, we may collect the following types of information:</p>
            <div className="space-y-2 mt-2">
              <Bullet><span className="text-slate-300 font-semibold">Personal Information</span> — Name, email address, phone number, shipping address, and payment details</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Browsing Information</span> — IP addresses, browser type, and cookies</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Transaction Details</span> — Items ordered, payment method, and delivery preferences</Bullet>
            </div>
          </Section>

          <Section
            title="How We Use Your Information"
            accentColor="#22c55e"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          >
            <p>We use the information we collect to:</p>
            <div className="space-y-2 mt-2">
              <Bullet><span className="text-slate-300 font-semibold">Process Orders</span> — To complete transactions and deliver your products</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Improve Our Services</span> — To enhance your shopping experience and make our site more user-friendly</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Marketing</span> — To send you promotional offers, updates on new collections, and exclusive deals</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Customer Support</span> — To address any inquiries, returns, or issues you may have</Bullet>
            </div>
          </Section>

          <Section
            title="Sharing Your Information"
            accentColor="#a855f7"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          >
            <p>We respect your privacy and do not sell or trade your personal information. We may share data with trusted third-party partners solely for:</p>
            <div className="space-y-2 mt-2">
              <Bullet><span className="text-slate-300 font-semibold">Payment Processing</span> — To securely process your transactions</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Shipping</span> — To ensure timely delivery of your orders</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Analytics</span> — To track site performance and enhance your experience</Bullet>
            </div>
          </Section>

          <Section
            title="Protecting Your Information"
            accentColor="#ef4444"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          >
            <p>We implement strict security measures to safeguard your personal data:</p>
            <div className="space-y-2 mt-2">
              <Bullet><span className="text-slate-300 font-semibold">Encrypted Payments</span> — Secure payment gateways to protect your financial information</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Data Protection</span> — Regular monitoring and security protocols to prevent unauthorized access</Bullet>
            </div>
          </Section>

          <Section
            title="Your Rights"
            accentColor="#f59e0b"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p>You have the right to:</p>
            <div className="space-y-2 mt-2">
              <Bullet><span className="text-slate-300 font-semibold">Access Your Information</span> — Request details about the personal data we hold about you</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Update or Correct Information</span> — Ensure your details are accurate and up to date</Bullet>
              <Bullet><span className="text-slate-300 font-semibold">Delete Your Information</span> — Request deletion of your personal data, subject to legal obligations</Bullet>
            </div>
          </Section>

          <Section
            title="Cookies"
            accentColor="#6366f1"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" /></svg>}
          >
            <p>Our website uses cookies to personalize your shopping experience and track usage patterns. You can adjust your browser settings to decline cookies, but this may limit some features of the site.</p>
          </Section>

          <Section
            title="Changes to This Policy"
            accentColor="#f97316"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
          >
            <p>Ink Dapper may update this Privacy Policy periodically. Any changes will be posted on this page, and we encourage you to review it regularly.</p>
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
              Questions about our Privacy Policy? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <a href="mailto:inkdapper@gmail.com"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                inkdapper@gmail.com
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

export default PrivacyPolicy
