'use client'

import Link from 'next/link'
import type { ComponentType } from 'react'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { tradeMessages } from './messages'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RichText } from '@/components/sanity/RichText'
import { ArrowRight, Award, ChevronDown, Headphones, Tag, Users } from '@/components/ui/Icon'
import type { Image, TradeFaq } from '@/lib/sanity/types'

type BenefitKey = keyof (typeof tradeMessages)['en']['benefits']['items']

const BENEFITS: Array<{ key: BenefitKey; icon: ComponentType<{ className?: string }> }> = [
  { key: 'priceList', icon: Tag },
  { key: 'marketing', icon: Award },
  { key: 'support', icon: Headphones },
  { key: 'brands', icon: Users },
]

type Props = {
  image?: Image | null
  faqs: TradeFaq[]
}

export function TradeView({ image, faqs }: Props) {
  const m = useMessages(tradeMessages)

  return (
    <>
      <PageHero eyebrow={m.hero.eyebrow} title={m.hero.title} subtitle={m.hero.subtitle} image={image} size="lg">
        <Link href="/trade/apply" className="btn-primary mt-8">
          {m.hero.apply}
          <span aria-hidden="true">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </PageHero>

      <section className="section bg-black">
        <div className="container">
          <SectionHeading tag={m.benefits.tag} title={m.benefits.title} align="center" />
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ key, icon: IconCmp }) => (
              <li key={key} className="card p-7">
                <span aria-hidden="true" className="mb-5 flex h-12 w-12 items-center justify-center border border-red/30 bg-red/10 text-red">
                  <IconCmp className="h-6 w-6" />
                </span>
                <h3 className="text-off-white font-bold text-lg mb-2">{m.benefits.items[key].title}</h3>
                <p className="text-light text-sm leading-relaxed">{m.benefits.items[key].desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-dark">
        <div className="container">
          <SectionHeading tag={m.audience.tag} title={m.audience.title} align="center" />
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {m.audience.items.map((item) => (
              <li key={item.title} className="border border-dark-3 border-t-2 border-t-red bg-dark-2 p-6">
                <h3 className="font-display text-2xl text-off-white leading-none mb-3">{item.title}</h3>
                <p className="text-light text-sm leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-black">
        <div className="container">
          <SectionHeading tag={m.process.tag} title={m.process.title} align="center" />
          <ol className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-0">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-[2px] bg-gradient-to-r from-red/10 via-red to-red/10 md:block"
            />
            {m.process.steps.map((step, i) => (
              <li key={step.title} className="relative px-4 text-center">
                <span
                  aria-hidden="true"
                  className="relative z-10 mb-5 inline-flex h-16 w-16 items-center justify-center border-2 border-red bg-black font-display text-3xl text-red"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl text-off-white leading-none mb-3">{step.title}</h3>
                <p className="mx-auto max-w-[240px] text-light text-sm leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {faqs.length ? (
        <section className="section bg-dark">
          <div className="container max-w-3xl">
            <SectionHeading tag={m.faq.tag} title={m.faq.title} align="center" />
            <div className="mt-12 border border-dark-3">
              {faqs.map((faq) => (
                <details key={faq._id} className="group border-b border-dark-3 last:border-b-0">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 p-5 text-left text-off-white font-semibold hover:bg-dark-2 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span aria-hidden="true" className="shrink-0 text-red transition-transform group-open:rotate-180">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>
                  <div className="px-5 pb-1 text-sm">
                    <RichText value={faq.answer} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-sm bg-black">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-8 border-l-4 border-red bg-dark p-8 md:flex-row md:items-center md:p-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-3">{m.cta.tag}</p>
              <h2 className="font-display text-off-white leading-none mb-3 text-[clamp(2.5rem,5vw,4rem)]">{m.cta.title}</h2>
              <p className="text-light text-sm max-w-md leading-relaxed">{m.cta.text}</p>
            </div>
            <Link href="/trade/apply" className="btn-primary w-full shrink-0 justify-center md:w-auto">
              {m.cta.button}
              <span aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
