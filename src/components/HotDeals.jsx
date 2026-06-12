import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export default function HotDeals() {
  const [deals] = useState([
    { id: 1, name: 'iPhone 15 Pro Max', discount: '15%', image: '/images/p3.jpg', price: '₦1,850,000', originalPrice: '₦2,180,000', timeLeft: '2h 30m' },
    { id: 2, name: 'MacBook Air M3', discount: '20%', image: '/images/mp17.jpg', price: '₦1,350,000', originalPrice: '₦1,699,000', timeLeft: '4h 15m' },
    { id: 3, name: 'Sony WH-1000XM5', discount: '18%', image: '/images/mp8.jpg', price: '₦450,000', originalPrice: '₦550,000', timeLeft: '1h 45m' },
    { id: 4, name: 'GPS Smartwatch', discount: '12%', image: '/images/p4.jpg', price: '₦85,000', originalPrice: '₦96,000', timeLeft: '3h 20m' },
  ])

  return (
    <section className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5"></div>
      
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">🔥 Hot Deals - Limited Time</h2>
          </div>
          <p className="text-slate-400 ml-5">Don't miss out on these incredible discounts!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal, idx) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
            >
              {/* Discount Badge */}
              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{deal.discount}
              </div>

              {/* Timer */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-1 rounded-full text-xs text-orange-400 font-semibold">
                <Clock size={12} />
                {deal.timeLeft}
              </div>

              <div className="w-full h-40 overflow-hidden rounded-2xl bg-slate-950">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-white text-sm group-hover:text-sky-400 transition-colors line-clamp-2">
                  {deal.name}
                </h3>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-sky-400">{deal.price}</span>
                    <span className="text-xs text-slate-400 line-through">{deal.originalPrice}</span>
                  </div>
                </div>

                <button className="w-full mt-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform group-hover:scale-105">
                  Grab Deal
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
