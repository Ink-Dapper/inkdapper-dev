import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const POLICIES = [
  {
    icon: 'exchange_icon',
    metric: '∞',
    metricLabel: 'Free',
    title: 'Easy Exchange Policy',
    desc: 'Hassle-free exchanges with no questions asked. Not happy? We\'ll make it right.',
    accent: 'from-orange-500 to-amber-500',
    borderColor: 'rgba(249,115,22,0.25)',
    glow: 'rgba(249,115,22,0.18)',
  },
  {
    icon: 'quality_icon',
    metric: '7',
    metricLabel: 'Days',
    title: '7-Day Return Policy',
    desc: 'Full refund guarantee within 7 days. Shop confidently knowing we have your back.',
    accent: 'from-amber-500 to-orange-500',
    borderColor: 'rgba(245,158,11,0.25)',
    glow: 'rgba(245,158,11,0.18)',
  },
  {
    icon: 'support_img',
    metric: '24/7',
    metricLabel: 'Support',
    title: 'Best Customer Support',
    desc: 'Round-the-clock support whenever you need us. Our team is always ready to help.',
    accent: 'from-orange-600 to-amber-600',
    borderColor: 'rgba(234,88,12,0.25)',
    glow: 'rgba(234,88,12,0.18)',
  },
]

const OurPolicy = () => {
  const navigate = useNavigate()

  const handlePolicyClick = () => {
    navigate('/privacy-policy')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="py-10 md:py-14 ragged-section overflow-hidden relative">
      <div className="ragged-divider" />
      <div className="ragged-noise" />

      {/* Background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="ragged-pill text-[11px] font-bold uppercase tracking-widest px-2.5 py-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Our Commitment
              </span>
            </div>
            <h2 className="ragged-title text-3xl sm:text-4xl md:text-5xl leading-tight">
              Why Choose Ink Dapper?
            </h2>
            <p className="ragged-subtitle text-sm mt-1.5">
              Everything we do is designed around your satisfaction
            </p>
          </div>
          <button
            onClick={handlePolicyClick}
            className="hidden sm:inline-flex items-center gap-1.5 ragged-outline-btn font-semibold text-sm px-4 py-2 transition-all duration-200 flex-shrink-0"
          >
            View All Policies
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── Policy cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7">
          {POLICIES.map((policy, i) => (
            <div
              key={i}
              className="group relative rounded-2xl p-5 md:p-8 transition-all duration-300 hover:-translate-y-2 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${policy.borderColor}`,
                boxShadow: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 20px 60px ${policy.glow}`
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
            >
              {/* Top row: icon + metric badge */}
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${policy.accent} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <img
                    src={assets[policy.icon]}
                    alt={policy.title}
                    className="w-7 h-7 object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-extrabold bg-gradient-to-r ${policy.accent} bg-clip-text text-transparent leading-none`}>
                    {policy.metric}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wide">
                    {policy.metricLabel}
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-orange-300 transition-colors duration-200">
                {policy.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {policy.desc}
              </p>

              {/* Expanding bottom accent bar */}
              <div className={`mt-6 h-0.5 w-8 bg-gradient-to-r ${policy.accent} rounded-full group-hover:w-16 transition-all duration-500`} />
            </div>
          ))}
        </div>

        {/* ── Mobile CTA ──────────────────────────────────────────── */}
        <div className="sm:hidden text-center mt-8">
          <button
            onClick={handlePolicyClick}
            className="inline-flex items-center gap-2 ragged-solid-btn font-semibold text-sm px-6 py-2.5 transition-all duration-200"
          >
            Learn More About Our Policies
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}

export default OurPolicy
