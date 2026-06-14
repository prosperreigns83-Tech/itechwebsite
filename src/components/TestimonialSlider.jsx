import React from 'react'
import { resolveAssetPath } from '../utils/assetPath'

const TESTIMONIALS = [
  { name: 'Emeka Johnson', text: 'Great prices and fast delivery. Highly recommended.', image: '/images/pop1.png' },
  { name: 'Sarah Williams', text: 'Amazing products and customer support. Love shopping here.', image: '/images/pop2.png' },
  { name: 'David Okafor', text: 'Smooth shopping experience. I\'ve bought multiple gadgets.', image: '/images/pop2.png' },
]

export default function TestimonialSlider(){
  return (
    <section className="mt-6">
      <div className="text-sm text-slate-400">What Our Customers Say</div>
      <div className="mt-3 grid grid-cols-3 gap-4">
        {TESTIMONIALS.map((t,i)=> (
          <div key={i} className="bg-white/3 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <img src={resolveAssetPath(t.image)} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-slate-300">★★★★★</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-200">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
