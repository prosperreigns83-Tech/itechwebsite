import React from 'react'

export default function PromoBanner(){
  return (
    <aside className="w-72 p-4 rounded-2xl bg-gradient-to-b from-indigo-900 to-slate-900 text-white">
      <div className="text-sm text-sky-200 font-semibold">Ready to explore the best deals on tech?</div>
      <h4 className="mt-3 text-lg font-bold">Explore Store</h4>
      <p className="mt-2 text-slate-300 text-sm">Join thousands of smart shoppers today.</p>
      <div className="mt-4">
        <button className="px-4 py-2 rounded-full bg-sky-500 font-bold">Explore Store →</button>
      </div>
    </aside>
  )
}
