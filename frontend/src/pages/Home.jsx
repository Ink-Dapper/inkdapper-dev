import { Suspense, lazy } from 'react'
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
