import React from 'react'

export default function FooterCTA(){
  return (
    <div className="mt-8 py-6 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between">
      <div>
        <div className="text-lg font-bold">Don't Miss Out On Exclusive Deals & Offers</div>
        <div className="text-sm text-slate-100/80">Enter the store now and enjoy amazing discounts on top tech products.</div>
      </div>
      <div>
        <button className="px-6 py-3 rounded-full bg-white text-sky-600 font-bold">Go to Shop</button>
      </div>
    </div>
  )
}
