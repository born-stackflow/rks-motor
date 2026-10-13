'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, ShoppingCart } from '@/components/ui/Icon'
import { useMessages } from '@/contexts/LanguageContext'
import { modelDetailMessages } from '@/lib/i18n/messages/models'
import { cart, useCart } from '@/lib/cart'
import { imageUrl } from '@/lib/sanity/client'
import type { ModelDetail } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'
import { contactHref } from '../../_lib/specs'

const FEEDBACK_MS = 2500

export function EnquiryActions({ model }: { model: ModelDetail }) {
  const m = useMessages(modelDetailMessages)
  const entry = useCart().find((item) => item.id === model._id)
  const [justAdded, setJustAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const add = () => {
    cart.add({
      id: model._id,
      kind: 'model',
      name: model.name,
      slug: model.slug,
      price: model.price,
      image: imageUrl(model.image ?? model.heroImage, 200) ?? undefined,
    })
    setJustAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setJustAdded(false), FEEDBACK_MS)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={add}
        className={cn(
          'flex h-[52px] w-full items-center justify-center gap-3 border text-sm font-bold uppercase tracking-widest text-white transition-colors duration-300',
          justAdded ? 'border-green-600 bg-green-700' : 'border-red bg-red hover:bg-red-dark',
        )}
      >
        {justAdded ? <CheckCircle className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
        {justAdded ? m.added : m.addToList}
      </button>
      <p role="status" className="sr-only">
        {justAdded ? m.addedStatus(model.name) : ''}
      </p>
      {entry ? (
        <Link
          href="/cart"
          className="flex min-h-10 items-center justify-between gap-3 border border-dark-3 px-4 text-xs text-light transition-colors hover:border-red hover:text-off-white"
        >
          <span>{m.inList(entry.qty)}</span>
          <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-red">
            {m.viewList} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      ) : null}
      <Link href={contactHref('purchase', model.name)} className="btn-secondary w-full justify-center">
        {m.requestInfo} <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href={contactHref('test-ride', model.name)} className="btn-ghost w-full justify-center text-xs">
        {m.testRide}
      </Link>
    </div>
  )
}
