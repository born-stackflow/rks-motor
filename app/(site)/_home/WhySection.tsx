'use client'

import { motion } from 'framer-motion'
import { Headphones, Users, Wrench, Zap } from '@/components/ui/Icon'
import { useMessages } from '@/contexts/LanguageContext'
import { homeMessages } from '@/lib/i18n/messages/home'
import type { Image } from '@/lib/sanity/types'
import { ParallaxBg } from './ParallaxBg'
import { SectionTag } from './SectionHeader'

const ICONS = [Zap, Wrench, Users, Headphones]

export function WhySection({ background }: { background?: Image }) {
  const t = useMessages(homeMessages).why

  return (
    <section className="section relative overflow-hidden bg-dark">
      <ParallaxBg image={background} opacity={0.05} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(204,0,0,0.06)_0%,transparent_70%)]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container relative">
        <div className="mb-14 text-center">
          <SectionTag label={t.tag} />
          <h2 className="mb-4 font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-off-white">{t.title}</h2>
          <p className="mx-auto max-w-xl text-light">{t.subtitle}</p>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <motion.li
                key={item.title}
                initial={{ y: 24 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="card group relative overflow-hidden p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[2px] w-0 bg-red transition-all duration-500 group-hover:w-full"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-0 w-[2px] bg-red transition-all delay-100 duration-500 group-hover:h-full"
                />
                <div className="mb-5 flex h-12 w-12 items-center justify-center bg-red/10 text-red">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-base font-bold text-off-white transition-colors group-hover:text-red">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-light">{item.desc}</p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
