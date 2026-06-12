import React from 'react'

const categories = ['Phones & Tablets','Laptops & Computers','Accessories','Smart Watches','Audio & Headphones','Gaming','Cameras & Photography','TV & Home Appliances','Drones & Gadgets','More']

export default function CategoryGrid(){
  return (
    <div className="my-6 overflow-x-auto">
      <div className="flex gap-4 min-w-max">
        {categories.map((c,i)=> (
          <div key={i} className="min-w-[110px] bg-white/3 text-white/90 py-3 px-4 rounded-xl flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center">📦</div>
            <div className="text-xs text-slate-200">{c}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
