'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowRight, Check, ChevronDown, Building2, Users, Globe, Truck, BadgePercent, Headphones } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

const steps = [
  { n: '01', title: 'Apply',    desc: 'Submit your trade partner application with your business credentials and dealership details.' },
  { n: '02', title: 'Review',   desc: 'Our trade team reviews your application within 3–5 business days and may arrange a call.' },
  { n: '03', title: 'Agree',    desc: 'Sign the partnership agreement and receive access to our Trade Portal and wholesale pricing.' },
  { n: '04', title: 'Launch',   desc: 'Receive your first model allocation, co-op marketing materials, and start selling RKS.' },
]

const benefits = [
  { icon: <BadgePercent className="h-7 w-7 text-red" />, title: 'Wholesale Pricing',      desc: 'Competitive trade margins on motorcycles, parts, and accessories with volume-based incentives.' },
  { icon: <Truck className="h-7 w-7 text-red" />,        title: 'Priority Allocation',    desc: 'First access to new model launches, limited editions, and high-demand variants.' },
  { icon: <Headphones className="h-7 w-7 text-red" />,   title: 'Dedicated Support',      desc: 'A dedicated trade account manager and 24-hour parts support line.' },
  { icon: <Users className="h-7 w-7 text-red" />,        title: 'Marketing Co-Op',        desc: 'Co-branded marketing materials, event support, and digital assets at no cost.' },
  { icon: <Globe className="h-7 w-7 text-red" />,        title: 'Global Network',         desc: 'Join a worldwide dealer community with shared intelligence and best practices.' },
  { icon: <Building2 className="h-7 w-7 text-red" />,   title: 'Training & Certification', desc: 'Factory-certified technician training and annual product knowledge updates.' },
]

const personas = [
  { title: 'Motorcycle Dealers',  icon: '🏪', points: ['Full model inventory access', 'Showroom display support', 'Test ride allocation', 'Parts & service margin'] },
  { title: 'Distributors',        icon: '🌍', points: ['Regional exclusivity options', 'Bulk volume discounts', 'Logistics support', 'Market development funds'] },
  { title: 'Fleet Buyers',        icon: '🚗', points: ['Multi-unit pricing', 'Dedicated account manager', 'Flexible delivery scheduling', 'Service contracts available'] },
]

const faqs = [
  { q: 'What are the minimum order requirements?', a: 'For new dealers, we require a minimum initial order of 5 units and a committed annual purchase volume. Specific requirements depend on your territory and model mix.' },
  { q: 'Is there an application fee?', a: 'There is no fee to apply. Our trade partnership is based entirely on merit, business credentials, and market fit.' },
  { q: 'How long does the approval process take?', a: 'Most applications receive an initial response within 3–5 business days. Full approval and agreement signing typically takes 2–3 weeks.' },
  { q: 'Do you offer exclusivity in my territory?', a: 'We offer territorial exclusivity to qualified dealers and distributors in markets where it aligns with our strategic goals. This is discussed during the partnership agreement stage.' },
  { q: 'What training is provided?', a: 'All trade partners receive access to our RKS Academy programme — including product knowledge, technical training, and sales methodology — both online and at our Milan facility.' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' } }),
}

export default function TradePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <ImagePlaceholder />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-4">B2B Partnership</p>
              <h1
                className="text-off-white leading-none mb-4"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3.5rem, 8vw, 7rem)', letterSpacing: '0.02em' }}
              >
                Trade Partners
              </h1>
              <div className="h-[3px] w-[60px] bg-red mb-6" />
              <p className="text-light text-lg max-w-xl leading-relaxed mb-8">
                Join the RKS global dealer and distributor network. Access wholesale pricing, exclusive model allocations, and world-class marketing support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/trade/apply" className="btn-primary">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how-it-works" className="btn-secondary">
                  How It Works
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section bg-dark">
        <div className="container">
          <SectionHeading tag="Simple Process" title="How It Works" subtitle="Four steps from application to your first model allocation." align="center" />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-[2.2rem] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-red/10 via-red to-red/10 pointer-events-none" />
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="relative text-center px-4"
              >
                {/* Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black border-2 border-red mb-5 relative z-10">
                  <span
                    className="text-red"
                    style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', letterSpacing: '0.05em' }}
                  >
                    {step.n}
                  </span>
                </div>
                <h3
                  className="text-off-white text-2xl mb-3 leading-none"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-light text-sm leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-red" />

      {/* Benefits */}
      <section className="section bg-black relative overflow-hidden">
        <div className="container relative">
          <SectionHeading tag="Partnership Benefits" title="What You Get" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="card p-7 group hover:border-red"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{b.icon}</div>
                <h3 className="text-off-white font-bold text-lg mb-2 group-hover:text-red transition-colors">{b.title}</h3>
                <p className="text-light text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section bg-dark relative overflow-hidden">
        <div className="container relative">
          <SectionHeading tag="Eligibility" title="Who Is It For?" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {personas.map((p, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="card-elevated p-8 border-t-2 border-t-red"
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3
                  className="text-off-white text-2xl mb-5 leading-none"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {p.title}
                </h3>
                <ul className="space-y-3">
                  {p.points.map(pt => (
                    <li key={pt} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-red shrink-0" />
                      <span className="text-light text-sm">{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-black">
        <div className="container max-w-3xl">
          <SectionHeading tag="Questions" title="Frequently Asked" align="center" />
          <div className="mt-12 space-y-0 border border-dark-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-dark-3 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-dark transition-colors"
                >
                  <span className="text-off-white font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-red shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-light text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-sm bg-dark">
        <div className="container">
          <div className="relative p-10 md:p-14 border-l-4 border-red overflow-hidden">
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-3">Ready to Partner?</p>
                <h2
                  className="text-off-white leading-none mb-3"
                  style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  Let's Grow Together
                </h2>
                <p className="text-light text-sm max-w-md leading-relaxed">
                  Applications reviewed within 5 business days. Complete the form — our trade team will be in touch.
                </p>
              </div>
              <Link href="/trade/apply" className="btn-primary shrink-0">
                Apply as Trade Partner <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
