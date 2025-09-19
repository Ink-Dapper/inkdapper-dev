import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import RecentlyViewed from '../components/RecentlyViewed'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'

const Home = () => {
  return (
    <div>
      <h1 className="sr-only">Home - Ink Dapper</h1>
      <h2 className="sr-only">Hero Section</h2>
      <Hero />
      <h2 className="header-visibility sr-only">Latest Collection</h2>
      <LatestCollection />
      <h2 className="header-visibility sr-only">Best Seller</h2>
      <BestSeller />
      <h2 className="header-visibility sr-only">Recently Viewed</h2>
      <RecentlyViewed />
      <h2 className="header-visibility sr-only">Our Policy</h2>
      <OurPolicy />
      <h2 className="header-visibility sr-only">Newsletter</h2>
      <NewsLetterBox />
    </div>
  )
}

export default Home