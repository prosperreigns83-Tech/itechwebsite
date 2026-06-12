import React from 'react'
import { Search, ShoppingCart, Menu } from 'lucide-react'

export default function Navbar({ onNavigate }){
  return (
    <header className="w-full flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-lg">ITECH <span className="text-sky-200">STORE</span></div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <button type="button" className="nav-item" onClick={() => onNavigate?.('splash')}>Home</button>
          <button type="button" className="nav-item" onClick={() => onNavigate?.('about')}>About Us</button>
          <button type="button" className="nav-item" onClick={() => onNavigate?.('login')}>Categories</button>
          <button type="button" className="nav-item" onClick={() => onNavigate?.('login')}>Sellers</button>
          <button type="button" className="nav-item" onClick={() => onNavigate?.('login')}>Deals</button>
          <button type="button" className="nav-item" onClick={() => onNavigate?.('contact')}>Contact</button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="search" className="p-2 rounded-full bg-transparent hover:bg-white/5"><Search size={18} /></button>
        <button aria-label="cart" className="relative p-2 rounded-full bg-transparent hover:bg-white/5">
          <ShoppingCart size={18} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </button>
        <button className="md:hidden p-2 rounded-full bg-transparent"><Menu size={18} /></button>
      </div>
    </header>
  )
}
