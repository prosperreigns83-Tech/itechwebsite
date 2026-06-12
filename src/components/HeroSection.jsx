import React from 'react'

const HERO_PRODUCTS = [
  // { title: 'AirPods Pro 2', price: '₦310,000', image: '' },
  // { title: 'MacBook Air M3', price: '₦1,350,000', image: '' },
  // { title: 'Sony WH-1000XM5', price: '₦450,000', image: '/images/mp8.jpg' },
]

export default function HeroSection({ onGoShop }){
  return (
    <section
      className="relative overflow-hidden min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/hero-building.jpg")',
      }}
    >
      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.05),rgba(15,23,42,0.58))]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="max-w-3xl space-y-8 sm:space-y-10">
          <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-sky-100 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/15 text-sky-200 font-bold">IT</div>
            <span className="uppercase tracking-[0.24em] font-semibold text-sky-100/90">ITECH STORE</span>
          </div>

          <h1 className="mt-2 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to the premium technology marketplace.
          </h1>

          <p className="text-base leading-7 text-slate-200/90 sm:text-lg sm:leading-8">
            Discover a modern corporate hub for trusted gadgets, expert sellers, and luxury tech experiences — all built for professional buyers and high-value brands.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={onGoShop}
              className="w-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 sm:w-auto"
            >
              Go To Shop
            </button>
            <button className="w-full rounded-full border border-white/20 bg-white/10 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/15 sm:w-auto">
              Become A Seller
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {HERO_PRODUCTS.map((product) => (
              <div key={product.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-sm">
                <div className="overflow-hidden rounded-3xl bg-slate-950">
                  <img src={product.image} alt={product.title} className="h-28 w-full object-cover" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-semibold text-white">{product.title}</div>
                  <div className="text-xs text-slate-400 mt-1">Just in, premium gadget</div>
                  <div className="mt-3 text-xl font-bold text-sky-300">{product.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-sm">
              <div className="text-3xl font-bold">98%</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Customer Satisfaction</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-sm">
              <div className="text-3xl font-bold">5K+</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Verified Sellers</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-sm">
              <div className="text-3xl font-bold">24/7</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Support,Assurance & ITECH AI</div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-sm">
              <div className="text-3xl font-bold">500+</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Top Brands</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-sm">
              <div className="text-3xl font-bold">1.2M</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Monthly Visits</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-sm">
              <div className="text-3xl font-bold">99.8%</div>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Fulfillment Rate</div>

                          
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
