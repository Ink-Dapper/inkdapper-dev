import React, { useContext, useState, useEffect } from 'react';
import { apiConfig } from '../config/api';
import apiInstance from '../utils/axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const PERKS = [
  { icon: '🎁', text: '20% off your first order' },
  { icon: '⚡', text: 'First access to new drops' },
  { icon: '🏷️', text: 'Members-only flash sales' },
  { icon: '🚀', text: 'Style tips & lookbooks' },
]

const TRUST = [
  {
    icon: (
      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ), label: 'No spam, ever'
  },
  {
    icon: (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ), label: 'Secure & private'
  },
  {
    icon: (
      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ), label: 'Unsubscribe anytime'
  },
]

const NewsLetterBox = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const { backendUrl, token, usersDetails } = useContext(ShopContext);

  const apiUrl = apiConfig.baseURL;

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const cachedEmail = localStorage.getItem('newsletter_subscribed_email');
        if (cachedEmail) { setIsSubscribed(true); setIsCheckingSubscription(false); return; }

        const userEmail = localStorage.getItem('user_email') || sessionStorage.getItem('user_email');
        if (userEmail) {
          try {
            const headers = {};
            if (token) headers.token = token;
            const response = await apiInstance.post('/newsletter/check-subscription', { email: userEmail }, { headers });
            if (response.data.isSubscribed) {
              setIsSubscribed(true);
              localStorage.setItem('newsletter_subscribed_email', userEmail);
            }
          } catch (_) { }
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      } finally {
        setIsCheckingSubscription(false);
      }
    };
    checkSubscriptionStatus();
  }, [apiUrl]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscription = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      toast.error('Please enter a valid email address.');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      try { await apiInstance.get('/test'); } catch (_) {
        setError('Backend server is not running. Please try again later.');
        toast.error('Backend server is not running. Please try again later.');
        return;
      }

      const subscriptionData = { email, name: email.split('@')[0] };
      if (token) {
        if (usersDetails && usersDetails.length > 0) {
          const user = usersDetails[0];
          subscriptionData.name = user.name;
          subscriptionData.phone = user.phone ? user.phone.toString() : '';
        } else {
          const userName = localStorage.getItem('user_name');
          const userPhone = localStorage.getItem('user_phone');
          if (userName) subscriptionData.name = userName;
          if (userPhone) subscriptionData.phone = userPhone;
        }
      }

      const headers = {};
      if (token) headers.token = token;
      const response = await apiInstance.post('/newsletter/subscribe', subscriptionData, { headers });

      if (response.data.success) {
        setSuccess('🎉 Subscribed! Welcome to Ink Dapper.');
        setIsSubscribed(true);
        localStorage.setItem('newsletter_subscribed_email', email);
        toast.success('🎉 Subscription successful! Welcome to Ink Dapper newsletter!');
        setEmail('');
      } else {
        const errorMsg = response.data.message || 'Failed to subscribe. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      let errorMessage = 'Failed to subscribe. Please try again.';
      if (err.response?.data?.message === 'Email already subscribed to newsletter') {
        setIsSubscribed(true);
        localStorage.setItem('newsletter_subscribed_email', email);
        setSuccess('You\'re already subscribed! 🎉');
        toast.success('You are already subscribed to our newsletter! 🎉');
        setEmail('');
        return;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Service not found. Please make sure the backend is running.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────
  if (isCheckingSubscription) {
    return (
      <section className="relative py-12 overflow-hidden" style={{ background: '#0d0d0e' }}>
        <div className="ragged-noise" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Loading...</span>
        </div>
      </section>
    );
  }

  // ── Already subscribed ───────────────────────────────────────────
  if (isSubscribed) {
    return (
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: '#0d0d0e' }}>
        <div className="ragged-noise" />
        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.06), transparent 65%)' }} />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(249,115,22,0.04), transparent 70%)' }} />

        <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6">

          {/* ── Card wrapper ── */}
          <div className="relative rounded-2xl overflow-hidden text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.2)' }}>
            {/* Green top accent bar */}
            <div className="absolute top-0 left-0 w-full h-0.5"
              style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a, transparent)' }} />
            {/* Corner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top, rgba(34,197,94,0.08), transparent 70%)' }} />

            <div className="relative p-8 md:p-10">

              {/* Icon with ring */}
              <div className="relative inline-flex items-center justify-center mb-6">
                {/* Outer pulse ring */}
                <div className="absolute w-24 h-24 rounded-full animate-ping opacity-20"
                  style={{ background: 'rgba(34,197,94,0.3)' }} />
                {/* Mid ring */}
                <div className="absolute w-20 h-20 rounded-full"
                  style={{ border: '1px solid rgba(34,197,94,0.25)' }} />
                {/* Icon circle */}
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 28px rgba(34,197,94,0.35)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-green-400">Active Member</span>
              </div>

              {/* Heading */}
              <h2 className="mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '0.08em', color: '#f1f5f9', lineHeight: 1.05 }}>
                You're All Set!
              </h2>

              {/* Fading divider */}
              <div className="mx-auto mb-4 h-px max-w-xs"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)' }} />

              <p className="text-slate-400 text-sm leading-relaxed mb-7">
                You're already part of the{' '}
                <span className="text-green-400 font-semibold">Ink Dapper</span>{' '}
                community. Keep an eye on your inbox for exclusive deals and style updates.
              </p>

              {/* Benefits grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-7">
                {[
                  { label: 'Exclusive Deals', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
                  { label: 'Style Updates', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { label: 'Flash Sales', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 rounded-xl px-2 py-3"
                    style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.icon} />
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Fading divider */}
              <div className="mx-auto mb-4 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.1), transparent)' }} />

              {/* Trust row */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                {TRUST.map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs">
                    {t.icon}
                    {t.label}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>
    );
  }

  // ── Subscription form ────────────────────────────────────────────
  return (
    <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: '#0d0d0e' }}>
      <div className="ragged-noise" />
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07), transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05), transparent 70%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }} />
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">Newsletter</span>
          <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: promo content ─────────────────────────────── */}
          <div>
            {/* Pulse badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">Exclusive Offer</span>
            </div>

            {/* Heading */}
            <h2 className="mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.08em', color: '#f1f5f9', lineHeight: 1.05 }}>
              Stay In The{' '}
              <span style={{ color: '#f97316' }}>Loop</span>
            </h2>

            <p className="text-slate-500 text-base mb-5 leading-relaxed">
              Join <span className="text-slate-200 font-semibold">10,000+</span> Ink Dapper fans and unlock member-only perks, early access, and your exclusive welcome discount.
            </p>

            {/* 20% badge */}
            <div className="inline-flex items-center gap-4 rounded-2xl px-5 py-3.5 mb-7"
              style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.18)' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', color: '#f97316', lineHeight: 1, letterSpacing: '0.05em' }}>20%</span>
              <div className="w-px h-10 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(249,115,22,0.4), transparent)' }} />
              <div>
                <div className="text-slate-200 font-semibold text-sm">OFF your first order</div>
                <div className="text-slate-600 text-xs mt-0.5">Applied automatically at checkout</div>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.15), transparent)' }} />

            {/* Perks list */}
            <ul className="space-y-3">
              {PERKS.map((perk, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)' }}>
                    {perk.icon}
                  </div>
                  <span className="text-slate-700 text-sm">{perk.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: form card ────────────────────────────────── */}
          <div className="relative rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}>
            {/* Orange top accent bar */}
            <div className="absolute top-0 left-0 w-full h-0.5"
              style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
            {/* Corner glow */}
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(249,115,22,0.07), transparent 70%)' }} />

            <div className="relative p-6 md:p-8">
              {/* Card heading */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-0.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: '1.4rem', color: '#f1f5f9' }}>Subscribe Now</h3>
              </div>
              <p className="text-slate-600 text-sm mb-5">Drop your email below and we'll handle the rest.</p>

              {/* Divider */}
              <div className="mb-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.15), transparent)' }} />

              <form onSubmit={handleSubscription} className="space-y-4">
                {/* Email input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all text-sm"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,115,22,0.2)' }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-[0.1em]"
                  style={{
                    background: isLoading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #f97316, #f59e0b)',
                    color: '#0d0d0e',
                    boxShadow: isLoading ? 'none' : '0 0 20px rgba(249,115,22,0.25)',
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0d0d0e] border-t-transparent rounded-full animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Get My 20% Discount
                    </>
                  )}
                </button>
              </form>

              {/* Status messages */}
              {error && (
                <div className="mt-4 p-3 rounded-xl text-red-400 text-xs flex items-center gap-2"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 p-3 rounded-xl text-green-400 text-xs flex items-center gap-2"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {success}
                </div>
              )}

              {/* Divider */}
              <div className="mt-6 mb-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.1), transparent)' }} />

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 justify-center">
                {TRUST.map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs">
                    {t.icon}
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsLetterBox;
