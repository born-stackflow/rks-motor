'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Phone, Mail, Globe, Clock, Search, MapPin, ArrowRight } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import Link from 'next/link'

const dealers = [
  {
    id: '1', name: 'RKS Milano Centro', type: 'flagship',
    address: 'Via del Corso 123, 20121 Milano, Italy',
    phone: '+39 02 1234 5678', email: 'milano@rks.com',
    website: 'https://milano.rks.com',
    services: ['Sales', 'Service', 'Parts', 'Trade', 'Racing'],
    hours: { weekday: '9:00 – 19:00', saturday: '9:00 – 18:00', sunday: 'Closed' },
    country: 'Italy', city: 'Milano',
  },
  {
    id: '2', name: 'RKS London Chelsea', type: 'dealer',
    address: '45 Kings Road, Chelsea, London SW3 4LY, UK',
    phone: '+44 20 7123 4567', email: 'london@rks.com',
    website: 'https://london.rks.com',
    services: ['Sales', 'Service', 'Parts'],
    hours: { weekday: '9:00 – 18:00', saturday: '9:00 – 17:00', sunday: 'Closed' },
    country: 'United Kingdom', city: 'London',
  },
  {
    id: '3', name: 'RKS Paris Champs-Élysées', type: 'dealer',
    address: '123 Champs-Élysées, 75008 Paris, France',
    phone: '+33 1 42 12 34 56', email: 'paris@rks.com',
    website: 'https://paris.rks.com',
    services: ['Sales', 'Service', 'Parts'],
    hours: { weekday: '9:00 – 19:00', saturday: '10:00 – 18:00', sunday: 'Closed' },
    country: 'France', city: 'Paris',
  },
  {
    id: '4', name: 'RKS Berlin Mitte', type: 'dealer',
    address: 'Unter den Linden 42, 10117 Berlin, Germany',
    phone: '+49 30 123 45678', email: 'berlin@rks.com',
    website: 'https://berlin.rks.com',
    services: ['Sales', 'Service', 'Parts', 'Trade'],
    hours: { weekday: '9:00 – 18:30', saturday: '9:00 – 16:00', sunday: 'Closed' },
    country: 'Germany', city: 'Berlin',
  },
  {
    id: '5', name: 'RKS Madrid', type: 'dealer',
    address: 'Calle Gran Vía 18, 28013 Madrid, Spain',
    phone: '+34 91 123 4567', email: 'madrid@rks.com',
    website: 'https://madrid.rks.com',
    services: ['Sales', 'Service', 'Parts'],
    hours: { weekday: '9:00 – 20:00', saturday: '10:00 – 18:00', sunday: 'Closed' },
    country: 'Spain', city: 'Madrid',
  },
  {
    id: '6', name: 'RKS Amsterdam', type: 'service',
    address: 'Keizersgracht 412, 1016 GC Amsterdam, Netherlands',
    phone: '+31 20 123 4567', email: 'amsterdam@rks.com',
    website: 'https://amsterdam.rks.com',
    services: ['Service', 'Parts'],
    hours: { weekday: '8:30 – 17:30', saturday: '9:00 – 14:00', sunday: 'Closed' },
    country: 'Netherlands', city: 'Amsterdam',
  },
]

const countries = ['All', ...Array.from(new Set(dealers.map(d => d.country))).sort()]
const typeMap: Record<string, string> = { flagship: 'Flagship', dealer: 'Authorized Dealer', service: 'Service Centre' }
const typeBadge: Record<string, string> = { flagship: 'bg-red/20 text-red border border-red/40', dealer: 'bg-dark-3 text-light border border-dark-3', service: 'bg-gold/20 text-gold border border-gold/40' }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } }),
}

export default function DealersPage() {
  const [search,  setSearch]  = useState('')
  const [country, setCountry] = useState('All')
  const [active,  setActive]  = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return dealers.filter(d => {
      if (q && !d.name.toLowerCase().includes(q) && !d.city.toLowerCase().includes(q)) return false
      if (country !== 'All' && d.country !== country) return false
      return true
    })
  }, [search, country])

  const activeDealer = active ? dealers.find(d => d.id === active) : null

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[260px] overflow-hidden">
        <ImagePlaceholder />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">50+ Locations</p>
            <h1
              className="text-off-white leading-none mb-2"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.02em' }}
            >
              Find a Dealer
            </h1>
            <div className="h-[3px] w-[60px] bg-red" />
          </div>
        </div>
      </section>

      <div className="container py-10">
        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mid" />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10 text-sm w-full"
            />
          </div>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="select text-sm h-[52px] px-4 w-full sm:w-48"
          >
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Two-column: list + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Dealer list */}
          <div className="space-y-3 lg:max-h-[680px] lg:overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="h-10 w-10 text-red/40 mx-auto mb-4" />
                <p className="text-light text-sm">No dealers match your search.</p>
              </div>
            ) : (
              filtered.map((d, i) => (
                <motion.button
                  key={d.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  onClick={() => setActive(d.id === active ? null : d.id)}
                  className={`w-full text-left card overflow-hidden transition-all duration-200 ${d.id === active ? 'border-red shadow-red-sm' : 'hover:border-red'}`}
                >
                  <div className="relative aspect-[16/6] overflow-hidden">
                    <ImagePlaceholder icon={MapPin} />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute top-3 left-3">
                      <span className={`badge text-xs ${typeBadge[d.type]}`}>{typeMap[d.type]}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-off-white font-bold text-base mb-1 group-hover:text-red transition-colors">{d.name}</h3>
                    <div className="flex items-start gap-2 text-light text-xs">
                      <MapPin className="h-3.5 w-3.5 text-red shrink-0 mt-0.5" />
                      <span>{d.address}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {d.services.map(s => (
                        <span key={s} className="badge bg-dark-3 text-light border border-dark-3 text-[10px]">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>

          {/* Detail panel or map placeholder */}
          <div className="sticky top-[88px] h-fit">
            {activeDealer ? (
              <motion.div
                key={activeDealer.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8"
              >
                <div className="relative aspect-[16/7] overflow-hidden mb-6">
                  <ImagePlaceholder icon={MapPin} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`badge text-xs ${typeBadge[activeDealer.type]}`}>{typeMap[activeDealer.type]}</span>
                  </div>
                </div>

                <h2 className="text-3xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {activeDealer.name}
                </h2>
                <div className="h-[3px] w-[40px] bg-red mb-6" />

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-red shrink-0 mt-0.5" />
                    <span className="text-light text-sm">{activeDealer.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-red shrink-0" />
                    <a href={`tel:${activeDealer.phone}`} className="text-light text-sm hover:text-red transition-colors">{activeDealer.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-red shrink-0" />
                    <a href={`mailto:${activeDealer.email}`} className="text-light text-sm hover:text-red transition-colors">{activeDealer.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-red shrink-0" />
                    <a href={activeDealer.website} target="_blank" rel="noopener noreferrer" className="text-light text-sm hover:text-red transition-colors">{activeDealer.website}</a>
                  </div>
                </div>

                <div className="border-t border-dark-3 pt-5 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-light mb-3 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-red" /> Opening Hours
                  </p>
                  {Object.entries(activeDealer.hours).map(([day, hrs]) => (
                    <div key={day} className="flex justify-between text-sm py-1 border-b border-dark-3 last:border-0">
                      <span className="text-mid capitalize">{day === 'weekday' ? 'Mon – Fri' : day}</span>
                      <span className="text-off-white">{hrs}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a href={`tel:${activeDealer.phone}`} className="btn-primary flex-1 justify-center text-xs">
                    Call Now
                  </a>
                  <Link href={`/contact?dealer=${activeDealer.id}`} className="btn-secondary flex-1 justify-center text-xs">
                    Send Enquiry
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="relative bg-dark border border-dark-3 aspect-[16/11] flex flex-col items-center justify-center overflow-hidden">
                <ImagePlaceholder className="opacity-40" />
                <div className="relative text-center px-8">
                  <MapPin className="h-12 w-12 text-red mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Select a Dealer</h3>
                  <p className="text-light text-sm">Click any dealer on the left to see full details, hours, and contact information.</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-mid text-center">
                    {filtered.length} dealer{filtered.length !== 1 ? 's' : ''} shown
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* B2B callout */}
        <div className="mt-16 p-8 md:p-12 border-l-4 border-red bg-dark relative overflow-hidden">
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-2">For Business</p>
              <h3 className="text-3xl text-off-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Interested in Becoming a Dealer?</h3>
              <p className="text-light text-sm max-w-lg">Join our trade partner network and get access to wholesale pricing, model allocations, and marketing support.</p>
            </div>
            <Link href="/trade/apply" className="btn-primary shrink-0">
              Apply as Trade Partner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
