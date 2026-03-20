import React, { useState, useEffect, useRef, memo, useCallback, useContext } from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { assets } from '../assets/assets';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const INTERESTS = ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Custom Designs'];

const inputBase = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(249,115,22,0.2)',
  color: '#e2e8f0',
  outline: 'none',
};

const NewsletterModal = () => {
  const { token, usersDetails } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interests: [] });
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [focused, setFocused] = useState('');

  // Show after 6s if not seen before
  useEffect(() => {
    if (!localStorage.getItem('hasSeenNewsletterModal')) {
      const t = setTimeout(() => setIsOpen(true), 6000);
      return () => clearTimeout(t);
    }
  }, []);

  // Pre-fill for logged-in users
  useEffect(() => {
    if (token && usersDetails?.length > 0) {
      const u = usersDetails[0];
      setFormData(p => ({
        ...p,
        name: u.users?.name || u.name || '',
        email: u.users?.email || u.email || '',
        phone: u.users?.phone ? u.users.phone.toString() : (u.phone ? u.phone.toString() : ''),
      }));
    }
  }, [token, usersDetails]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('hasSeenNewsletterModal', 'true');
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  }, []);

  const handleInterestChange = useCallback((interest) => {
    setFormData(p => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter(i => i !== interest)
        : [...p.interests, interest],
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/newsletter/subscribe', formData);
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', interests: [] });
      }, 2200);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, handleClose]);

  if (!isOpen) return null;

  const isLoggedIn = token && usersDetails?.length > 0;
  const loggedUser = isLoggedIn ? (usersDetails[0].users || usersDetails[0]) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col md:flex-row"
        style={{
          background: '#0d0d0e',
          border: '1px solid rgba(249,115,22,0.2)',
          boxShadow: '0 0 60px rgba(249,115,22,0.12), 0 24px 64px rgba(0,0,0,0.6)',
          maxHeight: '90vh',
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, #f97316, #f59e0b, transparent)' }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Left image panel ── */}
        <div className="hidden md:block w-5/12 relative flex-shrink-0" style={{ minHeight: '480px' }}>
          <div className="absolute inset-0" style={{ background: 'rgba(13,13,14,0.3)' }} />
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          )}
          <img
            src={assets.banner_one}
            alt="Ink Dapper Collection"
            className="w-full h-full object-cover"
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, transparent 60%, #0d0d0e 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(13,13,14,0.7) 0%, transparent 50%)' }} />
          {/* Badge on image */}
          <div className="absolute bottom-5 left-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(13,13,14,0.75)', border: '1px solid rgba(249,115,22,0.3)', backdropFilter: 'blur(8px)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">Exclusive Drops</span>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 overflow-y-auto">

          {submitted ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 30px rgba(249,115,22,0.4)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.1em', color: '#f1f5f9' }}>
                You're In!
              </h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">
                Welcome to the Ink Dapper community. Exclusive drops coming your way.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">Members Only</span>
                </div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                  letterSpacing: '0.08em',
                  color: '#f1f5f9',
                  lineHeight: 1.1,
                }}>
                  Join The Drop List
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                  First access to new collections, exclusive deals &amp; style drops straight to your inbox.
                </p>
              </div>

              {/* Form */}
              <form id="newsletter-form" onSubmit={handleSubmit} className="space-y-3">

                {isLoggedIn ? (
                  /* Logged-in user card */
                  <div className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e' }}>
                      {(loggedUser?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-300 truncate">{loggedUser?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{loggedUser?.email}</p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">✓ Verified</span>
                    </div>
                  </div>
                ) : (
                  /* Guest fields */
                  <>
                    {[
                      { id: 'newsletter-name', name: 'name', type: 'text', placeholder: 'Your Name', required: true, autoComplete: 'name' },
                      { id: 'newsletter-email', name: 'email', type: 'email', placeholder: 'Email Address', required: true, autoComplete: 'email' },
                      { id: 'newsletter-phone', name: 'phone', type: 'tel', placeholder: 'Phone Number (optional)', autoComplete: 'tel' },
                    ].map(({ id, name, type, placeholder, required, autoComplete }) => (
                      <input
                        key={name}
                        id={id}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={formData[name]}
                        onChange={handleInputChange}
                        onFocus={() => setFocused(name)}
                        onBlur={() => setFocused('')}
                        required={required}
                        autoComplete={autoComplete}
                        className="w-full px-4 py-3 rounded-xl text-sm placeholder-slate-600 transition-all duration-200"
                        style={{
                          ...inputBase,
                          border: focused === name
                            ? '1px solid rgba(249,115,22,0.55)'
                            : '1px solid rgba(249,115,22,0.2)',
                          boxShadow: focused === name ? '0 0 0 3px rgba(249,115,22,0.08)' : 'none',
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Interests */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 mb-2">I'm interested in</p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => {
                      const checked = formData.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestChange(interest)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                          style={{
                            background: checked ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                            border: checked ? '1px solid rgba(249,115,22,0.45)' : '1px solid rgba(255,255,255,0.08)',
                            color: checked ? '#fb923c' : '#64748b',
                          }}
                        >
                          {checked && <span className="mr-1">✓</span>}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-[0.12em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? 'rgba(249,115,22,0.5)' : 'linear-gradient(135deg, #f97316, #f59e0b)',
                    color: '#0d0d0e',
                    boxShadow: loading ? 'none' : '0 0 24px rgba(249,115,22,0.4)',
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Subscribe Now
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-600">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>

              {/* Social row */}
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700 mb-3">Follow Us</p>
                <div className="flex justify-center gap-3">
                  <a
                    href="https://www.instagram.com/inkdapper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', color: '#f472b6' }}
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/919994005696"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(NewsletterModal);
