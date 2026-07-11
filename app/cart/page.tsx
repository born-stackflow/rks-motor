'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ArrowRight } from '@/components/ui/Icon'
import { formatPrice } from '@/lib/utils'

type CartItem = {
  _id: string
  name: string
  slug: string
  price?: number
  image?: string
  qty: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('rks-cart')
    if (raw) setItems(JSON.parse(raw))
    setLoaded(true)
  }, [])

  const save = (next: CartItem[]) => {
    setItems(next)
    localStorage.setItem('rks-cart', JSON.stringify(next))
  }

  const remove = (id: string) => save(items.filter(i => i._id !== id))

  const total = items.reduce((acc, i) => acc + (i.price ?? 0) * i.qty, 0)

  if (!loaded) return null

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <ShoppingCart className="h-6 w-6 text-red" />
          <h1 className="text-off-white leading-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3.5rem', letterSpacing: '0.04em' }}>
            Your Cart
          </h1>
          <span className="ml-auto text-sm text-mid font-mono">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-dark-3">
            <ShoppingCart className="h-12 w-12 text-dark-3 mx-auto mb-5" />
            <p className="text-light text-lg mb-6">Your cart is empty.</p>
            <Link href="/models" className="btn-primary inline-flex">
              Browse Models <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Items */}
            <div className="space-y-2">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={item._id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-5 bg-dark border border-dark-3 p-5">
                    {item.image && (
                      <div className="relative w-24 h-16 shrink-0 bg-black">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link href={`/models/${item.slug}`}
                            className="text-off-white font-bold text-base hover:text-red transition-colors line-clamp-1"
                            style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.04em', fontSize: '1.3rem' }}>
                        {item.name}
                      </Link>
                      {item.price ? (
                        <p className="text-gold text-sm font-mono mt-0.5">{formatPrice(item.price)}</p>
                      ) : (
                        <p className="text-mid text-sm mt-0.5">Contact for price</p>
                      )}
                    </div>
                    <button onClick={() => remove(item._id)}
                            className="w-8 h-8 bg-dark-2 border border-dark-3 flex items-center justify-center text-mid hover:text-red hover:border-red transition-colors shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="bg-dark border border-dark-3 p-6 h-fit sticky top-24">
              <p className="text-[10px] uppercase tracking-[0.3em] text-mid mb-5 font-bold">Order Summary</p>

              <div className="space-y-3 mb-5 text-sm">
                {items.map(i => (
                  <div key={i._id} className="flex justify-between gap-2 text-light">
                    <span className="line-clamp-1">{i.name}</span>
                    <span className="shrink-0 text-off-white font-mono">
                      {i.price ? formatPrice(i.price) : '—'}
                    </span>
                  </div>
                ))}
              </div>

              {total > 0 && (
                <div className="flex justify-between items-center border-t border-dark-3 pt-4 mb-6">
                  <span className="text-sm text-light uppercase tracking-widest">Total</span>
                  <span className="text-gold font-bold text-xl font-mono">{formatPrice(total)}</span>
                </div>
              )}

              <div className="space-y-3">
                <Link href="/contact?type=purchase"
                      className="btn-primary w-full justify-center">
                  Enquire to Purchase <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/models" className="btn-ghost w-full justify-center text-xs">
                  Continue Browsing
                </Link>
              </div>

              <p className="text-[10px] text-mid text-center mt-4 leading-relaxed">
                Final pricing confirmed by dealer.<br />No payment taken online.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
