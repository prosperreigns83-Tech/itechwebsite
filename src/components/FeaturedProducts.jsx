import React, { useEffect, useMemo, useRef } from 'react'
import ProductCard from './ProductCard'
import FlashTimer from './FlashTimer'

const FEATURED = [
  { title: 'AirPods Pro 2', price: '₦310,000', subtitle: 'Premium Sound', image: '/images/p1.jpg' },
  { title: 'iPhone 15 Pro', price: '₦1,450,000', subtitle: '256GB, Titanium', image: '/images/p3.jpg' },
  { title: 'GPS Smartwatch', price: '₦85,000', subtitle: 'AMOLED Display', image: '/images/p4.jpg' },
  { title: 'MacBook Air M3', price: '₦1,350,000', subtitle: '8GB RAM, 256GB SSD', image: '/images/mp17.jpg' },
  { title: 'Sony WH-1000XM5', price: '₦450,000', subtitle: 'Noise Cancelling', image: '/images/mp8.jpg' },
]

export default function FeaturedProducts({ onNavigate }){
  const scrollRef = useRef(null)
  const pauseAutoScroll = useRef(false)
  const flashEndTime = useMemo(() => Date.now() + 15 * 60 * 60 * 1000, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const step = () => {
      if (pauseAutoScroll.current) return
      const maxScroll = container.scrollWidth - container.clientWidth
      const next = Math.min(container.scrollLeft + container.clientWidth * 0.9, maxScroll)
      if (container.scrollLeft >= maxScroll - 2) {
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        container.scrollTo({ left: next, behavior: 'smooth' })
      }
    }

    const interval = window.setInterval(step, 4200)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="featured-panel mt-6">
      <div className="featured-header">
        <div>
          <div className="featured-tag">Featured Products</div>
          <div className="featured-title">Top picks for you</div>
        </div>
        <button className="text-sm text-slate-300 transition-colors duration-300 hover:text-white">View all →</button>
      </div>

      <div className="mb-4">
        <FlashTimer endTime={flashEndTime} onSeeAll={() => onNavigate?.('categories')} title="Flash Deals" buttonLabel="View all" />
      </div>

      <div
        ref={scrollRef}
        className="featured-scroll"
        onMouseEnter={() => { pauseAutoScroll.current = true }}
        onMouseLeave={() => { pauseAutoScroll.current = false }}
      >
        {FEATURED.map((p,i)=> (
          <ProductCard key={i} {...p} style={{ animationDelay: `${i * 130}ms` }} />
        ))}
      </div>
    </section>
  )
}
