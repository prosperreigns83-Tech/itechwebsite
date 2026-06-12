import React from 'react'

export default function TrustSection(){
  return (
    <section className="mt-6 py-6 bg-gradient-to-b from-white/2 to-transparent rounded-2xl px-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-slate-400">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5K+</div>
            <div className="text-sm text-slate-400">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm text-slate-400">Customer Satisfaction</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-300">Trusted marketplace</div>
          <div className="mt-2">
            <button className="px-4 py-2 rounded-full bg-sky-500 text-white font-semibold">Explore Store</button>
          </div>
        </div>
      </div>
    </section>
  )
}
