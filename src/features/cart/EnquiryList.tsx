'use client'

import { useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowRight, Gauge, Minus, Plus, ShoppingCart, Wrench, X } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { useLanguage, useMessages } from '@/lib/i18n/LanguageContext'
import { cart, useCart, type CartItem } from '@/lib/cart'
import { cartMessages } from './messages'
import { formatPrice } from '@/lib/utils'

const noopSubscribe = () => () => {}

/** Only Sanity CDN images are allowed by next.config; anything else saved by older versions is skipped. */
const isSanityImage = (url: string | undefined): url is string => !!url && url.startsWith('https://cdn.sanity.io/')

const itemHref = (item: CartItem) => `/${item.kind === 'part' ? 'parts' : 'models'}/${item.slug}`

export function EnquiryList() {
  const { t } = useLanguage()
  const m = useMessages(cartMessages)
  const items = useCart()
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const [confirmClear, setConfirmClear] = useState(false)

  const allPriced = items.length > 0 && items.every((item) => typeof item.price === 'number' && item.price > 0)
  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0)
  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const summaryText = items.map((item) => `${item.qty}× ${item.name}`).join('; ')
  const enquiryHref = `/contact?type=purchase&items=${encodeURIComponent(summaryText)}`

  return (
    <div className="bg-black">
      <div className="border-b border-dark-3 bg-dark-2">
        <div className="container py-10 md:py-14 animate-fade-up">
          <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">{m.eyebrow}</p>
          <h1 className="font-display text-off-white leading-none text-[clamp(2.75rem,6vw,5rem)] tracking-[0.02em]">{m.title}</h1>
          <span className="heading-underline" />
          <p className="mt-5 max-w-2xl text-light leading-relaxed">{m.intro}</p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          {!hydrated ? (
            <p aria-busy="true" className="border border-dark-3 bg-dark px-6 py-16 text-center text-light">
              {t.common.loading}
            </p>
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-3xl">
              <EmptyState
                icon={ShoppingCart}
                title={m.emptyTitle}
                description={m.emptyText}
                action={{ label: m.emptyModels, href: '/models' }}
              />
              <p className="mt-6 text-center text-sm text-light">
                {m.emptyPartsPrompt}{' '}
                <Link href="/parts" className="font-semibold text-red-light underline underline-offset-4 hover:text-off-white">
                  {m.emptyParts}
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section aria-labelledby="enquiry-items">
                <h2 id="enquiry-items" className="mb-4 text-xs font-semibold uppercase tracking-widest text-light">
                  {m.count(count)}
                </h2>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 border border-dark-3 bg-dark p-4">
                      <Link
                        href={itemHref(item)}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="relative h-16 w-20 shrink-0 overflow-hidden product-shot sm:h-20 sm:w-28"
                      >
                        {isSanityImage(item.image) ? (
                          <Image src={item.image} alt="" fill sizes="112px" className="object-contain p-1" />
                        ) : (
                          <ImagePlaceholder icon={item.kind === 'part' ? Wrench : Gauge} />
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-widest text-light">{m.kind[item.kind]}</p>
                        <Link
                          href={itemHref(item)}
                          className="block font-display text-2xl leading-tight text-off-white transition-colors hover:text-red break-words"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-sm">
                          {item.price ? (
                            <span className="font-mono text-gold">{formatPrice(item.price)}</span>
                          ) : (
                            <span className="text-light">{t.common.priceOnRequest}</span>
                          )}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div role="group" aria-label={`${m.quantity}: ${item.name}`} className="flex items-center border border-dark-3">
                            <button
                              type="button"
                              onClick={() => cart.setQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              aria-label={m.decrease(item.name)}
                              className="flex h-10 w-10 items-center justify-center text-light transition-colors hover:text-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-light"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <output aria-live="polite" className="w-10 text-center font-mono text-sm text-off-white">
                              {item.qty}
                            </output>
                            <button
                              type="button"
                              onClick={() => cart.setQty(item.id, item.qty + 1)}
                              aria-label={m.increase(item.name)}
                              className="flex h-10 w-10 items-center justify-center text-light transition-colors hover:text-red"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => cart.remove(item.id)}
                            aria-label={m.remove(item.name)}
                            className="inline-flex min-h-10 items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-light transition-colors hover:text-red"
                          >
                            <X className="h-4 w-4" />
                            {m.removeShort}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex min-h-10 flex-wrap items-center gap-3">
                  {confirmClear ? (
                    <>
                      <span className="text-sm text-off-white">{m.clearConfirm}</span>
                      <button
                        type="button"
                        onClick={() => {
                          cart.clear()
                          setConfirmClear(false)
                        }}
                        className="inline-flex min-h-10 items-center px-3 text-xs font-semibold uppercase tracking-wider text-red-light hover:text-off-white"
                      >
                        {m.clearYes}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="inline-flex min-h-10 items-center px-3 text-xs font-semibold uppercase tracking-wider text-light hover:text-off-white"
                      >
                        {m.clearNo}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-light transition-colors hover:text-red"
                    >
                      <X className="h-4 w-4" />
                      {m.clear}
                    </button>
                  )}
                </div>
              </section>

              <aside aria-labelledby="enquiry-summary" className="h-fit border border-dark-3 bg-dark p-6 lg:sticky lg:top-24">
                <h2 id="enquiry-summary" className="mb-5 text-xs font-semibold uppercase tracking-widest text-light">
                  {m.summary}
                </h2>
                <ul className="mb-5 space-y-3 text-sm">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 text-light">
                      <span className="min-w-0 break-words">
                        <span className="font-mono text-off-white">{item.qty}×</span> {item.name}
                      </span>
                      <span className="shrink-0 font-mono text-off-white">
                        {item.price ? formatPrice(item.price * item.qty) : '—'}
                      </span>
                    </li>
                  ))}
                </ul>

                {allPriced ? (
                  <div className="mb-2 flex items-center justify-between border-t border-dark-3 pt-4">
                    <span className="text-sm uppercase tracking-widest text-light">{m.total}</span>
                    <span className="font-mono text-xl font-bold text-gold">{formatPrice(total)}</span>
                  </div>
                ) : null}
                <p className="mb-6 text-xs leading-relaxed text-light">{allPriced ? m.totalNote : m.partialPriceNote}</p>

                <Link href={enquiryHref} className="btn-primary w-full justify-center">
                  {m.send}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/models" className="btn-ghost mt-2 w-full justify-center">
                  {m.continue}
                </Link>
                <p className="mt-4 text-center text-xs leading-relaxed text-light">{m.noPayment}</p>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
