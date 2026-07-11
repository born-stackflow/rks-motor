'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import { Check, X, ArrowRight } from '@/components/ui/Icon'
import { formatPrice } from '@/lib/utils'
import { urlFor } from '@/lib/sanity'
import type { BikeModelCard, EBikeSpecs } from '@/lib/sanity'

export type CompareModel = BikeModelCard & { specs?: EBikeSpecs }

const BRAND_LABELS: Record<string, string> = {
  aperyder: 'Ape Ryder',
  rks:      'RKS',
  skyjet:   'Skyjet',
}

const AVAIL_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  'in-stock':     { label: 'In Stock',     variant: 'green' },
  'pre-order':    { label: 'Pre-Order',    variant: 'amber' },
  'coming-soon':  { label: 'Coming Soon',  variant: 'gold'  },
  'discontinued': { label: 'Discontinued', variant: 'dark'  },
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=800&q=85'

type SpecField = { key: keyof EBikeSpecs; label: string; suffix?: string }

const SPEC_GROUPS: { title: string; fields: SpecField[] }[] = [
  {
    title: 'Motor & Battery',
    fields: [
      { key: 'motor',        label: 'Motor' },
      { key: 'maxSpeed',     label: 'Max Speed', suffix: ' km/h' },
      { key: 'ridingModes',  label: 'Riding Modes' },
      { key: 'range',        label: 'Range' },
      { key: 'battery',      label: 'Battery' },
      { key: 'chargingTime', label: 'Charging Time' },
    ],
  },
  {
    title: 'Display & Lights',
    fields: [
      { key: 'displayPanel', label: 'Display Panel' },
      { key: 'frontLight',   label: 'Front Light' },
      { key: 'rearLight',    label: 'Rear Light' },
    ],
  },
  {
    title: 'Suspension & Brakes',
    fields: [
      { key: 'frontFork',      label: 'Front Fork' },
      { key: 'rearSuspension', label: 'Rear Suspension' },
      { key: 'brakes',         label: 'Brakes' },
      { key: 'tires',          label: 'Tires' },
    ],
  },
  {
    title: 'Drivetrain',
    fields: [
      { key: 'gearSystem', label: 'Gear System' },
      { key: 'chainring',  label: 'Chainring' },
      { key: 'derailleur', label: 'Derailleur' },
    ],
  },
  {
    title: 'Frame & Body',
    fields: [
      { key: 'frame',       label: 'Frame' },
      { key: 'saddle',      label: 'Saddle' },
      { key: 'pedals',      label: 'Pedals' },
      { key: 'bag',         label: 'Bag / Carrier' },
      { key: 'fender',      label: 'Fender' },
      { key: 'rearCarrier', label: 'Rear Carrier' },
      { key: 'weight',      label: 'Weight' },
    ],
  },
]

function hasAsset(img: unknown): img is { asset: unknown } {
  return typeof img === 'object' && img !== null && 'asset' in img
}

function modelImage(model: CompareModel): string {
  const src = model.thumbnailImage ?? model.heroImage
  if (src && hasAsset(src)) return urlFor(src).width(800).height(450).quality(85).url()
  return FALLBACK_IMG
}

function modelSlug(model: CompareModel): string {
  return model.slug?.current ?? ''
}

function specValue(model: CompareModel, field: SpecField): string | null {
  const raw = model.specs?.[field.key]
  if (raw === undefined || raw === null || raw === '') return null
  return `${raw}${field.suffix ?? ''}`
}

export default function CompareClient({ models }: { models: CompareModel[] }) {
  const [selected, setSelected] = useState<string[]>(models.slice(0, 2).map(m => m._id))

  const toggleModel = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const compared = models.filter(m => selected.includes(m._id))

  const visibleGroups = SPEC_GROUPS
    .map(group => ({
      ...group,
      fields: group.fields.filter(f => compared.some(m => specValue(m, f) !== null)),
    }))
    .filter(group => group.fields.length > 0)

  const allFeatures = Array.from(new Set(compared.flatMap(m => m.features ?? [])))

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-dark-3 bg-dark-2">
        <div className="container py-6">
          <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-2">Side by Side</p>
          <h1 className="text-4xl md:text-5xl text-off-white leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            Compare Models
          </h1>
        </div>
      </div>

      <div className="container py-8">
        {/* Model selector */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-light mb-4">Select up to 3 models to compare:</p>
          <div className="flex flex-wrap gap-3">
            {models.map(m => (
              <button
                key={m._id}
                onClick={() => toggleModel(m._id)}
                className={`flex items-center gap-3 px-4 py-2.5 border transition-all duration-200 ${
                  selected.includes(m._id)
                    ? 'border-red bg-red/10 text-off-white'
                    : selected.length >= 3
                    ? 'border-dark-3 text-mid cursor-not-allowed opacity-40'
                    : 'border-dark-3 text-light hover:border-red hover:text-off-white'
                }`}
                disabled={!selected.includes(m._id) && selected.length >= 3}
              >
                <div className="relative w-10 h-7 overflow-hidden">
                  <Image src={modelImage(m)} alt={m.name} fill className="object-cover" />
                </div>
                <span className="text-sm font-semibold">{m.name}</span>
                {selected.includes(m._id) && <X className="h-3.5 w-3.5 text-red" />}
              </button>
            ))}
          </div>
        </div>

        {compared.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-red/10 border border-red/20 flex items-center justify-center mb-5">
              <span className="text-3xl text-red" style={{ fontFamily: 'Bebas Neue' }}>VS</span>
            </div>
            <h3 className="text-3xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Select at Least 2 Models</h3>
            <p className="text-light text-sm">Choose models from the selector above to begin comparing.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Model headers */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${compared.length}, 1fr)` }}>
              <div /> {/* label column */}
              {compared.map(m => {
                const avail = AVAIL_MAP[m.availability ?? ''] ?? AVAIL_MAP['in-stock']
                return (
                  <div key={m._id} className="card overflow-hidden">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={modelImage(m)} alt={m.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Badge variant="red">{BRAND_LABELS[m.category] ?? m.category}</Badge>
                        <Badge variant={avail.variant}>{avail.label}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-off-white text-xl leading-none mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{m.name}</h2>
                      {m.price != null && <p className="text-gold font-bold text-lg">{formatPrice(m.price)}</p>}
                      <Link href={`/models/${modelSlug(m)}`} className="flex items-center gap-1 text-xs text-red font-semibold mt-3 hover:gap-2 transition-all">
                        View Full Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Spec comparison tables */}
            {visibleGroups.map(group => (
              <div key={group.title} className="mb-6 border border-dark-3">
                <div className="bg-dark-2 px-5 py-3">
                  <span className="text-red text-sm font-bold uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{group.title}</span>
                </div>
                {group.fields.map((field, i) => (
                  <div key={field.key} className={`grid gap-0 ${i % 2 === 0 ? 'bg-black' : 'bg-dark'}`} style={{ gridTemplateColumns: `200px repeat(${compared.length}, 1fr)` }}>
                    <div className="px-5 py-3.5 flex items-center border-t border-dark-3">
                      <span className="spec-label text-xs">{field.label}</span>
                    </div>
                    {compared.map(m => (
                      <div key={m._id} className="px-5 py-3.5 border-t border-l border-dark-3 flex items-center">
                        <span className="spec-value text-sm">{specValue(m, field) ?? '—'}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* Features comparison */}
            {allFeatures.length > 0 && (
              <div className="border border-dark-3">
                <div className="bg-dark-2 px-5 py-3">
                  <span className="text-red text-sm font-bold uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Features</span>
                </div>
                {allFeatures.map((feature, i) => (
                  <div key={feature} className={`grid gap-0 ${i % 2 === 0 ? 'bg-black' : 'bg-dark'}`} style={{ gridTemplateColumns: `200px repeat(${compared.length}, 1fr)` }}>
                    <div className="px-5 py-3.5 flex items-center border-t border-dark-3">
                      <span className="spec-label text-xs">{feature}</span>
                    </div>
                    {compared.map(m => (
                      <div key={m._id} className="px-5 py-3.5 border-t border-l border-dark-3 flex items-center">
                        {(m.features ?? []).includes(feature)
                          ? <Check className="h-4 w-4 text-green-400" />
                          : <X className="h-4 w-4 text-mid" />
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* CTA row */}
            <div className="grid gap-4 mt-6" style={{ gridTemplateColumns: `200px repeat(${compared.length}, 1fr)` }}>
              <div />
              {compared.map(m => (
                <div key={m._id} className="flex flex-col gap-3">
                  <Link href={`/models/${modelSlug(m)}`} className="btn-primary w-full justify-center text-xs">
                    View {m.name.split(' ')[0]} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href={`/contact?model=${modelSlug(m)}&type=purchase`} className="btn-secondary w-full justify-center text-xs">
                    Enquire
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
