import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Collection', to: '/collection' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const POLICY_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Shipping & Delivery', to: '/shipping-and-delivery' },
  { label: 'Cancellation & Refund', to: '/cancellation-and-refund' },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ink_dapper',
    color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61578085829726',
    color: 'hover:bg-blue-600',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/InkDapper',
    color: 'hover:bg-slate-600',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919994005696',
    color: 'hover:bg-green-600',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
      </svg>
    ),
  },
]

const Footer = () => {
  const { scrollToTop } = useContext(ShopContext)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <>
      {/* â”€â”€ Visit Our Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!isLoginPage && (
        <section className="w-full bg-slate-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-orange-500/20">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                Find Us
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">

              {/* Left: info */}
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Visit Our Store
                  </h2>
                  <p className="text-slate-200 text-sm mt-2 leading-relaxed">
                    We love meeting our customers! Drop by for an in-person Ink Dapper experience â€” feel the fabric, see the designs, and find your perfect fit.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-0.5">Ink Dapper Store</div>
                      <a href="https://maps.app.goo.gl/tY2PaHrWY7hsLT3a6" target="_blank" rel="noopener noreferrer" className="text-slate-200 text-sm hover:text-orange-400 transition-colors leading-relaxed">
                        1D, Bazaar Street, Vettuvanam<br />
                        Vellore - 635809, Tamil Nadu, India
                      </a>
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <a href="tel:+919994005696" className="text-slate-300 text-sm hover:text-orange-400 transition-colors font-medium">+91 9994005696</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <a href="mailto:support@inkdapper.com" className="text-slate-300 text-sm hover:text-orange-400 transition-colors font-medium">support@inkdapper.com</a>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    <span className="text-white font-semibold text-sm">Business Hours</span>
                    <span className="ml-auto inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Open Today
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">Mon <span className='text-slate-200'>&</span> Sat</div>
                      <div className="text-slate-200 text-sm font-medium">10 AM <span className='text-orange-500'>&</span> 8 PM</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">Sunday</div>
                      <div className="text-slate-200 text-sm font-medium">11 AM <span className='text-orange-500'>&</span> 6 PM</div>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/tY2PaHrWY7hsLT3a6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md transition-all duration-200 hover:scale-105 self-start"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Get Directions
                </a>
              </div>

              {/* Right: map */}
              <div className="relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 animate-bounce">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.02 11.54 7.32 11.79.41.34.95.34 1.36 0C13.98 22.54 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 13.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" />
                    </svg>
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-orange-500" />
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 mt-3">
                  <iframe
                    title="Ink Dapper Location"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d243.07177178382534!2d78.9224971!3d12.8981809!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad09f21a377d93%3A0xe92469a07eeff7df!2sInk%20Dapper!5e0!3m2!1sen!2sin!4v1753385910137!5m2!1sen!2sin"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px]"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ Main Footer Body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <footer className="relative overflow-hidden bg-slate-950 text-slate-300 border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 12% 15%, rgba(249,115,22,0.12) 0%, transparent 45%), radial-gradient(ellipse at 85% 85%, rgba(245,158,11,0.08) 0%, transparent 40%)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-8">

            {/* â”€â”€ Col 1: Brand â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="lg:col-span-1">
              <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <img src={assets.inkdapper_logo} alt="Ink Dapper" className="w-6 h-6 object-contain filter brightness-0 invert" />
                </div>
                <span className="text-xl font-bold text-slate-100">
                  <span className="font-light text-slate-300">Ink</span> Dapper
                </span>
              </Link>
              <p className="text-slate-200 text-sm leading-relaxed mb-5">
                Custom t-shirts, oversized tees, hoodies and sweatshirts designed for style, comfort, and self-expression.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-9 h-9 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-center text-slate-200 hover:text-white ${s.color} hover:border-transparent transition-all duration-200 hover:scale-110 hover:shadow-md`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* â”€â”€ Col 2: Quick Links â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div>
              <h4 className="text-slate-100 font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={scrollToTop}
                      className="group inline-flex items-center gap-2 text-slate-200 hover:text-orange-400 text-sm transition-colors duration-200"
                    >
                      <span className="w-1 h-1 bg-orange-400/60 rounded-full group-hover:bg-orange-500 transition-colors duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* â”€â”€ Col 3: Policies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div>
              <h4 className="text-slate-100 font-bold text-sm uppercase tracking-widest mb-5">Policies</h4>
              <ul className="space-y-3">
                {POLICY_LINKS.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={scrollToTop}
                      className="group inline-flex items-center gap-2 text-slate-200 hover:text-orange-400 text-sm transition-colors duration-200"
                    >
                      <span className="w-1 h-1 bg-orange-400/60 rounded-full group-hover:bg-orange-500 transition-colors duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* â”€â”€ Col 4: Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div>
              <h4 className="text-slate-100 font-bold text-sm uppercase tracking-widest mb-5">Get in Touch</h4>
              <ul className="space-y-4 flex flex-col items-start">
                <li>
                  <a href="tel:9994005696" className="flex items-center gap-3 text-slate-200 hover:text-orange-400 transition-colors duration-200 group">
                    <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300">+91 9994005696</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:support@inkdapper.com" className="flex items-center gap-3 text-slate-200 hover:text-orange-400 transition-colors duration-200 group">
                    <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300">support@inkdapper.com</span>
                  </a>
                </li>
                <li>
                  <Link to="/chatbot" className="flex items-center gap-3 text-slate-200 hover:text-orange-400 transition-colors duration-200 group">
                    <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300">Live Chat</span>
                  </Link>
                </li>
              </ul>

              {/* Trust chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure
                </span>
                <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-300 border border-orange-500/30 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                  Free Shipping
                </span>
                <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                  7-Day Returns
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* â”€â”€ Bottom bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-300 text-center sm:text-left px-[16vw] md:px-0">
              Copyright 2024 - {new Date().getFullYear()} © <span className="text-slate-300 font-semibold">inkdapper.com</span> - All Rights Reserved.
            </p>
            <p className="text-xs text-slate-300">
              Made with <span className="text-orange-400">Love</span> in India
            </p>
          </div>
        </div>

      </footer>
    </>
  )
}

export default Footer



