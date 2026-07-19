'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from './Badge'
import { ArrowRight, Wrench } from './Icon'
import { ImagePlaceholder } from './ImagePlaceholder'
import { formatPrice } from '@/lib/utils'

interface PartCardProps {
  name: string
  slug: string
  partNumber?: string
  category?: string
  price?: number
  image?: string
  availability?: 'in-stock' | 'order-required' | 'out-of-stock'
  compatibleCount?: number
  isOEM?: boolean
  index?: number
}

const availabilityMap = {
  'in-stock':       { label: 'In Stock',       variant: 'green' as const },
  'order-required': { label: 'Order Required',  variant: 'amber' as const },
  'out-of-stock':   { label: 'Out of Stock',    variant: 'red'   as const },
}

export function PartCard({ name, slug, partNumber, category, price, image, availability, compatibleCount, isOEM, index = 0 }: PartCardProps) {
  const src = image
  const avail = availability ? availabilityMap[availability] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className="group"
    >
      <Link href={`/parts/${slug}`} className="block h-full">
        <div className="card overflow-hidden h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-dark">
            {src ? (
              <Image
                src={src}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <ImagePlaceholder icon={Wrench} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
              {isOEM && <Badge variant="gold">OEM</Badge>}
              {avail && <Badge variant={avail.variant}>{avail.label}</Badge>}
            </div>
            {category && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="dark">{category}</Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg font-bold text-off-white mb-1 group-hover:text-red transition-colors leading-tight">
              {name}
            </h3>

            {partNumber && (
              <p
                className="text-gold text-xs mb-2 uppercase tracking-wider"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {partNumber}
              </p>
            )}

            {compatibleCount !== undefined && (
              <p className="text-xs text-mid mb-3">Fits {compatibleCount} model{compatibleCount !== 1 ? 's' : ''}</p>
            )}

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-3">
              {price ? (
                <span className="text-lg font-bold text-off-white">{formatPrice(price)}</span>
              ) : (
                <span className="text-xs text-mid uppercase tracking-wide">Contact for pricing</span>
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
