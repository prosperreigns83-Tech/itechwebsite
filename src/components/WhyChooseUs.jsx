import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Award, Users, Smartphone, RefreshCw } from 'lucide-react'

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Industry-leading SSL encryption protects your data',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Same-day delivery available in major cities',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only authorized sellers with verified ratings',
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Dedicated customer service team always available',
    },
    {
      icon: Smartphone,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy on all items',
    },
    {
      icon: RefreshCw,
      title: 'Best Prices',
      description: 'Price match guarantee on all products',
    },
  ]

  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">Why Choose ITECH STORE?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience with premium products, competitive prices, and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} className="text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {reason.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
