import React from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import CategoryGrid from './CategoryGrid'
import HotDeals from './HotDeals'
import FeaturedProducts from './FeaturedProducts'
import WhyChooseUs from './WhyChooseUs'
import TrustSection from './TrustSection'
import NewsletterCTA from './NewsletterCTA'
import TestimonialSlider from './TestimonialSlider'
import FooterCTA from './FooterCTA'

export default function LandingPage({ onGoShop, onNavigate }){
  return (
    <div className="home">
      <div className="content-wrapper">
        <Navbar onNavigate={onNavigate} />
        <HeroSection onGoShop={onGoShop} />
        
        {/* Hot Deals Section */}
        <section className="px-4 md:px-6 py-4">
          <HotDeals />
        </section>

        <div className="mt-4">
          <FeaturedProducts onNavigate={onNavigate} />
          <WhyChooseUs />
          <TrustSection />
          <TestimonialSlider />
        </div>
        {/* Newsletter CTA */}
        <section className="px-4 md:px-6 py-4">
          <NewsletterCTA />
        </section>

        <FooterCTA />
      </div>
    </div>
  )
}
