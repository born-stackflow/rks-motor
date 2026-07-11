'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from './Badge'
import { ArrowRight } from './Icon'
import { formatPrice } from '@/lib/utils'

interface ModelCardProps {
  name: string
  slug: string
  category: string
  price?: number
  tagline?: string
  image?: string
  isNew?: boolean
  isFeatured?: boolean
  engineCC?: number
  index?: number
  onCompare?: (slug: string) => void
  compareSelected?: boolean
}

const CATEGORY_IMAGES: Record<string, string> = {
  sport:     'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=800&q=85',
  racing:    'https://images.unsplash.com/photo-1551524164-6cf5ac833c2a?w=800&q=85',
  adventure: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=85',
  touring:   'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=85',
  cruiser:   'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=85',
  scooter:   'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=85',
  electric:  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=85',
}

const FALLBACK = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85'

export function ModelCard({
  name, slug, category, price, tagline, image, isNew, isFeatured, engineCC, index = 0, onCompare, compareSelected,
}: ModelCardProps) {
  const src = image || CATEGORY_IMAGES[category?.toLowerCase()] || FALLBACK

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative"
    >
      {onCompare && (
        <button
          onClick={(e) => { e.preventDefault(); onCompare(slug) }}
          className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-none border-2 flex items-center justify-center transition-all ${
            compareSelected ? 'bg-red border-red' : 'bg-black/60 border-dark-3 hover:border-red'
          }`}
          title="Compare"
        >
          {compareSelected && <span className="text-white text-[10px] leading-none">✓</span>}
        </button>
      )}

      <Link href={`/models/${slug}`} className="block h-full">
        <div className="card overflow-hidden h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-dark">
            <Image
              src={src}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 flex gap-2">
              {isNew && <Badge variant="gold">NEW</Badge>}
              {isFeatured && <Badge variant="red">FEATURED</Badge>}
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="red">{category}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {tagline && <p className="text-xs text-mid mb-1 uppercase tracking-wide">{tagline}</p>}
            <h3
              className="text-2xl text-off-white leading-none mb-3 group-hover:text-red transition-colors"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              {name}
            </h3>

            {engineCC && (
              <p className="text-gold text-sm font-medium mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {engineCC}cc
              </p>
            )}

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-3">
              {price ? (
                <span className="text-xl font-bold text-gold">{formatPrice(price)}</span>
              ) : (
                <span className="text-light text-sm">Contact for price</span>
              )}
              <span className="flex items-center gap-1 text-sm text-red font-semibold group-hover:gap-2 transition-all">
                View <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
