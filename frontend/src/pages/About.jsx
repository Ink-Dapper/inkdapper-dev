import React from 'react'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div className="ragged-section min-h-screen" style={{ background: '#0d0d0e' }}>
      <div className="ragged-noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">

        {/* ── Page Header ── */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }} />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">Who We Are</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }} />
          </div>
          <h1 className="ragged-title mb-4" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)' }}>
            Our Story
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Fashion is more than just clothing — it's a form of{' '}
            <span className="text-orange-400 font-semibold">self-expression.</span>
          </p>
        </div>

        {/* ── About Section: Image + Text ── */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start mb-10 md:mb-14">

          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-2 rounded-2xl blur-xl opacity-20 group-hover:opacity-35 transition duration-700" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }} />
            <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(249,115,22,0.18)', maxHeight: '550px' }}>
              <img
                src={assets.about_us}
                alt="Ink Dapper Team"
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition duration-700"
                style={{ maxHeight: 'auto' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,14,0.4), transparent)' }} />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">

            {/* Top: label + heading + paragraph */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Our Story</span>
              </div>

              <h2 className="ragged-title leading-tight" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: '#f8fafc' }}>
                Wear Your Story
              </h2>

              <p className="text-base text-slate-500 leading-relaxed">
                At <span className="text-orange-400 font-semibold">Ink Dapper</span>, we believe that fashion is more than just clothing — it's a form of self-expression.
                Founded with creativity at its core, we specialize in custom t-shirts, oversized tees, hoodies,
                and sweatshirts that empower you to wear your story.
              </p>
            </div>

            {/* Mission + Promise cards */}
            <div className="space-y-4">
              {/* Mission */}
              <div className="relative rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.12)' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 12px rgba(249,115,22,0.25)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-slate-200" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', fontSize: '1.1rem' }}>Our Mission</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      We're here to blur the lines between comfort and creativity. With a focus on premium quality
                      and individuality, we aim to provide clothing that's not only stylish but also feels great to wear, every day.
                    </p>
                  </div>
                </div>
              </div>

              {/* Promise */}
              <div className="relative rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.12)' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)', boxShadow: '0 0 12px rgba(245,158,11,0.25)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-slate-200" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', fontSize: '1.1rem' }}>Our Promise</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Each piece is crafted with care, using high-quality fabrics and thoughtful designs.
                      We value creativity, inclusivity, and sustainability — products that look great, last long, and feel good.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Divider ── */}
        <div className="relative my-10 md:my-14">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(249,115,22,0.2), transparent)' }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.6)' }} />
        </div>

        {/* ── Why Choose Us Header ── */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6))' }} />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">Why Choose Us</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.6), transparent)' }} />
          </div>
          <h2 className="ragged-title mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)' }}>
            Experience the Difference
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto px-4">
            We don't just sell clothes — we help you express your vibe. From casual streetwear to fully customized creations.
          </p>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 mb-12 md:mb-16">

          {[
            {
              num: '01',
              title: 'Quality Assurance',
              desc: 'Every piece is crafted with premium fabrics and attention to detail. Great style starts with great quality.',
              items: ['Soft and durable materials', 'Vibrant prints that stay fresh', 'Rigorous quality checks'],
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
            },
            {
              num: '02',
              title: 'Convenience',
              desc: 'Shopping with us is simple, smooth, and stress-free — from browsing to checkout and delivery.',
              items: ['User-friendly online store', 'Fast shipping & secure payments', 'Worldwide delivery'],
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
            {
              num: '03',
              title: 'Customer Service',
              desc: 'Our customer comes first. We\'re committed to providing responsive, friendly support always.',
              items: ['Easy returns and exchanges', 'Quick response time', 'Dedicated support team'],
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((card) => (
            <div
              key={card.num}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, transparent)' }} />
              {/* Inner hover glow — contained by overflow-hidden */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(249,115,22,0.07), transparent 70%)' }} />

              <div className="relative p-6 sm:p-7 flex flex-col h-full">
                {/* Top row: icon + number */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 18px rgba(249,115,22,0.3)' }}
                  >
                    {card.icon}
                  </div>
                  <span
                    className="text-3xl font-bold leading-none select-none"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'rgba(249,115,22,0.12)', letterSpacing: '0.04em' }}
                  >
                    {card.num}
                  </span>
                </div>

                {/* Heading + accent line */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-0.5 h-5 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
                  <h3 className="text-slate-200" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: '1.15rem' }}>{card.title}</h3>
                </div>

                <p className="text-sm text-slate-400 mb-5 leading-relaxed">{card.desc}</p>

                {/* Divider */}
                <div className="mb-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.2), transparent)' }} />

                {/* Feature list */}
                <ul className="space-y-2.5 mt-auto">
                  {card.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <div className="w-1 h-3.5 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(180deg, #f97316, #f59e0b)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="relative my-10 md:my-14">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(249,115,22,0.2), transparent)' }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: '#f97316', boxShadow: '0 0 8px rgba(249,115,22,0.6)' }} />
        </div>

        {/* ── CTA Section ── */}
        <div className="relative rounded-2xl p-8 sm:p-10 lg:p-12 text-center overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.22)' }}>
          {/* Glow blobs */}
          <div className="absolute top-0 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
          <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Join The Movement</span>
            </div>
            <h2 className="ragged-title mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
              Join the Ink Dapper Movement
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mb-7 max-w-2xl mx-auto leading-relaxed px-4">
              Whether you want to rock personalized designs, make a bold statement, or keep it cool with timeless essentials,
              Ink Dapper offers something for every personality and style.
            </p>
            <a
              href="/collection"
              className="inline-flex items-center gap-2 px-7 py-3 font-bold text-sm uppercase tracking-[0.12em] rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#0d0d0e', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}
            >
              Elevate Your Wardrobe
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* Newsletter */}
      <NewsLetterBox />
    </div>
  )
}

export default About
