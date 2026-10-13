'use client'

import Link from 'next/link'
import { useMessages } from '@/contexts/LanguageContext'
import { tradeMessages } from '@/lib/i18n/messages/trade'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLeft, ArrowRight, Mail } from '@/components/ui/Icon'
import type { Image, ModelNavItem } from '@/lib/sanity/types'
import { TradeApplyForm } from './TradeApplyForm'

type Props = {
  image?: Image | null
  email?: string
  models: ModelNavItem[]
}

export function TradeApplyView({ image, email, models }: Props) {
  const m = useMessages(tradeMessages)

  return (
    <>
      <PageHero eyebrow={m.apply.hero.eyebrow} title={m.apply.hero.title} image={image}>
        <Link
          href="/trade"
          className="mt-6 inline-flex min-h-[40px] items-center gap-2 text-xs font-semibold uppercase tracking-wider text-light hover:text-red-light"
        >
          <span aria-hidden="true">
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
          {m.apply.hero.back}
        </Link>
      </PageHero>

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <p className="text-light text-sm leading-relaxed mb-6">{m.apply.hero.intro}</p>
            <TradeApplyForm models={models} />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[96px] lg:self-start">
            <div className="border border-dark-3 border-t-2 border-t-red bg-dark p-6">
              <h2 className="font-display text-2xl text-off-white leading-none mb-5">{m.apply.aside.nextTitle}</h2>
              <ol className="space-y-4">
                {m.process.steps.map((item, i) => (
                  <li key={item.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center border border-red/30 bg-red/10 text-xs font-bold text-red-light"
                    >
                      {i + 1}
                    </span>
                    <p className="text-light text-sm leading-relaxed">
                      <span className="block text-off-white font-semibold">{item.title}</span>
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border border-dark-3 bg-dark p-6">
              <h2 className="font-display text-2xl text-off-white leading-none mb-2">{m.apply.aside.questionsTitle}</h2>
              <p className="text-light text-sm leading-relaxed mb-4">{m.apply.aside.questionsText}</p>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="mb-2 flex min-h-[40px] items-center gap-2 break-all text-sm font-semibold text-red-light hover:text-off-white"
                >
                  <span aria-hidden="true">
                    <Mail className="h-4 w-4" />
                  </span>
                  {email}
                </a>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex min-h-[40px] items-center gap-2 text-xs font-semibold uppercase tracking-wider text-off-white hover:text-red-light"
              >
                {m.apply.aside.contactCta}
                <span aria-hidden="true">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
