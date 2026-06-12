import React from 'react'

export default function ProductCard({ title, subtitle, price, oldPrice, image, onClick, style }){
  return (
    <article
      onClick={onClick}
      style={style}
      className="group relative bg-gradient-to-b from-[#0b1220] to-[#061026] p-3 rounded-[28px] shadow-2xl border border-white/8 w-56 overflow-hidden cursor-pointer transition-all duration-500 ease-out motion-safe:animate-card-float hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(15,23,42,0.45)]"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="product-card-glow" />
      </div>
      <div className="relative w-full h-40 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
        <img src={image || '/images/p1.jpg'} alt={title} className="object-contain w-full h-full p-4" />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        <p className="text-xs text-slate-400 truncate">{subtitle}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-white">{price}</div>
            {oldPrice && <div className="text-xs text-slate-500 line-through">{oldPrice}</div>}
          </div>
          <button className="bg-sky-500 p-2 rounded-full text-white shadow-[0_12px_24px_rgba(56,189,248,0.35)] transition-transform duration-300 hover:-translate-y-0.5">
            🛒
          </button>
        </div>
      </div>
    </article>
  )
}
