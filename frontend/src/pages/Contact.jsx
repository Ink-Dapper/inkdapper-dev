import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div className="ragged-section min-h-screen" style={{ background: '#0d0d0e' }}>
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">

        {/* ── Page Header ── */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }} />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">Get In Touch</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }} />
          </div>
          <h1 className="ragged-title mb-4" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)' }}>
            Contact Us
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Have a question, idea, or just want to say hi?{' '}
            <span className="text-orange-400 font-semibold">We'd love to hear from you.</span>
          </p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* Image */}
          <div className="relative group h-full">
            <div className="absolute -inset-2 rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition duration-700" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }} />
            <div className="relative rounded-2xl overflow-hidden h-full" style={{ border: '1px solid rgba(249,115,22,0.18)', maxHeight: 'auto' }}>
              <img
                src={assets.contact_img}
                alt="Contact us"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-700"
                style={{ maxHeight: 'auto' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,14,0.5), transparent 60%)' }} />
              {/* Bottom label overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(13,13,14,0.7)', border: '1px solid rgba(249,115,22,0.25)', backdropFilter: 'blur(8px)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Ink Dapper HQ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">

            {/* ── Store Info ── */}
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(249,115,22,0.18)' }}>
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
              {/* Corner glow */}
              <div className="absolute -top-10 -right-10 w-48 h-48 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent 65%)' }} />

              <div className="relative p-6">

                {/* ── Header row ── */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 20px rgba(249,115,22,0.35)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-0.5">Physical Store</p>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em', fontSize: '1.35rem', color: '#f1f5f9', lineHeight: 1 }}>
                        Visit Our Store
                      </h3>
                    </div>
                  </div>
                  {/* Live open badge */}
                  <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)' }}>
                    <span className="relative w-1.5 h-1.5 flex-shrink-0">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                      <span className="relative block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400 whitespace-nowrap">Open</span>
                  </div>
                </div>

                {/* ── Divider ── */}
                <div className="mb-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05), transparent)' }} />

                {/* ── Address block ── */}
                <div className="mb-5 p-4 rounded-xl flex items-start gap-4"
                  style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.1)' }}>
                  {/* Pin column */}
                  <div className="flex-shrink-0 flex flex-col items-center pt-0.5 gap-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
                      <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="w-px flex-1 min-h-[24px] rounded-full" style={{ background: 'linear-gradient(180deg, rgba(249,115,22,0.3), transparent)' }} />
                  </div>
                  {/* Text */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 mb-1">Address</p>
                    <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                      1D, Bazaar Street
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Vettuvanam, Vellore — 635809
                    </p>
                  </div>
                </div>

                {/* ── Info chips row ── */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px] text-slate-400 font-medium">All week</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[11px] text-slate-400 font-medium">9 AM – 8 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[11px] text-slate-400 font-medium">Walk-ins welcome</span>
                  </div>
                </div>

                {/* ── Get Directions CTA ── */}
                <a
                  href="https://maps.app.goo.gl/dpffYpGRsczWxq1r8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-[0.14em] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e', boxShadow: '0 0 24px rgba(249,115,22,0.35), 0 4px 12px rgba(0,0,0,0.3)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  Get Directions
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

              </div>
            </div>

            {/* ── Phone & Email ── */}
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316, transparent)' }} />
              <div className="relative p-6 space-y-0">
                {/* Phone row */}
                <div className="group flex items-center gap-4 py-4 transition-all duration-200 rounded-xl px-2 hover:bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 12px rgba(249,115,22,0.2)' }}>
                    <svg className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-0.5">Phone</p>
                    <a href="tel:+919994005696" className="text-sm font-semibold text-slate-300 hover:text-orange-400 transition-colors duration-200">
                      +91 99940 05696
                    </a>
                  </div>
                  <div className="w-0.5 h-8 rounded-full flex-shrink-0 opacity-30" style={{ background: 'linear-gradient(180deg, #f97316, transparent)' }} />
                </div>

                {/* Separator */}
                <div className="mx-2 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.1), transparent)' }} />

                {/* Email row */}
                <div className="group flex items-center gap-4 py-4 transition-all duration-200 rounded-xl px-2 hover:bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 12px rgba(245,158,11,0.2)' }}>
                    <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-0.5">Email</p>
                    <a href="mailto:support@inkdapper.com" className="text-sm font-semibold text-slate-300 hover:text-orange-400 transition-colors duration-200 truncate block">
                      support@inkdapper.com
                    </a>
                  </div>
                  <div className="w-0.5 h-8 rounded-full flex-shrink-0 opacity-30" style={{ background: 'linear-gradient(180deg, #f59e0b, transparent)' }} />
                </div>
              </div>
            </div>

            {/* ── Careers ── */}
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
              {/* Subtle corner glow inside overflow-hidden */}
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(249,115,22,0.08), transparent 70%)' }} />
              <div className="relative p-6">
                {/* Card heading */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
                    <svg className="w-[18px] h-[18px] text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-0.5 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: '1.1rem', color: '#f1f5f9' }}>Careers at Ink Dapper</h3>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mt-0.5">Join our amazing team</p>
                  </div>
                </div>
                {/* Divider */}
                <div className="mb-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.15), transparent)' }} />
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                  Learn more about our teams and job openings. We're always looking for talented individuals to join our mission.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-xs uppercase tracking-[0.12em] rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)'; }}
                >
                  Explore Jobs
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Newsletter */}
      <NewsLetterBox />
    </div>
  )
}

export default Contact
