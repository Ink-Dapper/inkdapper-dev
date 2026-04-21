import { Suspense, lazy } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import TrustBand from '../components/TrustBand'
import LatestCollection from '../components/LatestCollection'
import LazySection from '../components/LazySection'

const HighlightedProducts = lazy(() => import('../components/HighlightedProducts'))
const AcidWashTees = lazy(() => import('../components/AcidWashTees'))
const BestSeller = lazy(() => import('../components/BestSeller'))
const RecentlyViewed = lazy(() => import('../components/RecentlyViewed'))
const OurPolicy = lazy(() => import('../components/OurPolicy'))
const NewsLetterBox = lazy(() => import('../components/NewsLetterBox'))

const SectionFallback = ({ height = 360 }) => (
  <div className="px-4 sm:px-6 lg:px-8" style={{ minHeight: height }} aria-hidden="true">
    <div className="max-w-7xl mx-auto h-24 rounded-2xl bg-slate-800/40 animate-pulse mt-8" />
  </div>
)

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Ink Dapper | Oversized Tees, Acid Wash & Custom T-Shirts India</title>
        <meta name="description" content="Shop Ink Dapper's exclusive streetwear collection — acid wash oversized tees, custom DTF printed t-shirts, solid oversized fits & more. Free shipping. New drops weekly." />
        <link rel="canonical" href="https://www.inkdapper.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.inkdapper.com/" />
        <meta property="og:title" content="Ink Dapper | Oversized Tees, Acid Wash & Custom T-Shirts" />
        <meta property="og:description" content="Discover bold streetwear at Ink Dapper — acid wash tees, oversized custom prints, solid fits. Stand out with one-of-a-kind style. Shop now." />
        <meta property="og:image" content="https://www.inkdapper.com/ink_dapper_logo.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ink Dapper | Oversized Tees, Acid Wash & Custom T-Shirts" />
        <meta name="twitter:description" content="Discover bold streetwear at Ink Dapper — acid wash tees, oversized custom prints, solid fits. Shop now." />
        <meta name="twitter:image" content="https://www.inkdapper.com/ink_dapper_logo.svg" />
      </Helmet>

      <h1 className="sr-only">Home - Ink Dapper</h1>

      {/* Hero banner */}
      <h2 className="sr-only">Hero Section</h2>
      <Hero />

      {/* Trust / benefits strip */}
      <TrustBand />

      {/* Latest arrivals */}
      <h2 className="sr-only">Latest Collection</h2>
      <LatestCollection />

      {/* Featured / highlighted products */}
      <h2 className="sr-only">Featured Products</h2>
      <LazySection minHeight={420}>
        <Suspense fallback={<SectionFallback height={420} />}>
          <HighlightedProducts />
        </Suspense>
      </LazySection>

      {/* Acid wash collection */}
      <h2 className="sr-only">Acid Wash Collection</h2>
      <LazySection minHeight={420}>
        <Suspense fallback={<SectionFallback height={420} />}>
          <AcidWashTees />
        </Suspense>
      </LazySection>

      {/* Best sellers */}
      <h2 className="sr-only">Best Seller</h2>
      <LazySection minHeight={420}>
        <Suspense fallback={<SectionFallback height={420} />}>
          <BestSeller />
        </Suspense>
      </LazySection>

      {/* Loyalty / Credit Points promo */}
      <section className="py-10 md:py-14" style={{ background: 'linear-gradient(135deg, #0a0a0b 0%, #0f0f11 50%, #0a0a0b 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(245,158,11,0.08) 50%, rgba(249,115,22,0.06) 100%)', border: '1px solid rgba(249,115,22,0.25)', boxShadow: '0 0 40px rgba(249,115,22,0.08)' }}>
            {/* Background glow blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />

            <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left — text */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-300">Rewards Program</span>
                </div>
                <h2 className="ragged-title mb-3" style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)' }}>
                  Earn Credits,<br />Shop for Free
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                  Every order earns you <span className="text-orange-400 font-bold">Ink Dapper Credit Points</span>. Redeem them on your next purchase — the more you shop, the more you save.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/profile" className="ragged-solid-btn px-6 py-3 font-bold text-sm uppercase tracking-wide">
                    View My Credits
                  </Link>
                  <Link to="/collection" className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all duration-200">
                    Shop &amp; Earn
                  </Link>
                </div>
              </div>

              {/* Right — 3 benefit pills */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: '🛍️', title: '1 Point per ₹10 spent', desc: 'Automatically credited after every order' },
                  { icon: '💸', title: 'Redeem anytime', desc: 'Use credits as discount on checkout' },
                  { icon: '🎁', title: 'Bonus on referrals', desc: 'Refer a friend, both of you earn extra credits' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.12)' }}>
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      <h2 className="sr-only">Recently Viewed</h2>
      <LazySection minHeight={360}>
        <Suspense fallback={<SectionFallback height={360} />}>
          <RecentlyViewed />
        </Suspense>
      </LazySection>

      {/* Why choose us */}
      <h2 className="sr-only">Our Policy</h2>
      <LazySection minHeight={280}>
        <Suspense fallback={<SectionFallback height={280} />}>
          <OurPolicy />
        </Suspense>
      </LazySection>

      {/* Newsletter */}
      <h2 className="sr-only">Newsletter</h2>
      <LazySection minHeight={260}>
        <Suspense fallback={<SectionFallback height={260} />}>
          <NewsLetterBox />
        </Suspense>
      </LazySection>
    </div>
  )
}

export default Home
