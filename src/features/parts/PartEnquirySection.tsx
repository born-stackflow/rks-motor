'use client'

import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icon'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { partsMessages } from './messages'
import { PartEnquiryForm } from './PartEnquiryForm'

type Props = {
  /** Set on a part page: the copy is about that part and the form is prefilled with it. */
  part?: { name: string; partNumber?: string }
  models?: string[]
}

export const PART_ENQUIRY_ID = 'part-enquiry'

export function PartEnquirySection({ part, models }: Props) {
  const m = useMessages(partsMessages).enquiry
  const headingId = `${PART_ENQUIRY_ID}-title`

  return (
    <section id={PART_ENQUIRY_ID} aria-labelledby={headingId} className="section-sm scroll-mt-24 border-t border-dark-3 bg-black">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">{m.tag}</p>
          <h2 id={headingId} className="font-display text-5xl md:text-6xl leading-none text-off-white">
            {part ? m.detailTitle : m.title}
          </h2>
          <span className="heading-underline" />
          <p className="mt-5 max-w-md text-light leading-relaxed">{part ? m.detailSubtitle : m.subtitle}</p>
          <p className="mt-8 text-sm text-light">{m.contactPrompt}</p>
          <Link
            href="/contact"
            className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-light hover:text-off-white transition-colors"
          >
            {m.contactLink}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <PartEnquiryForm partName={part?.name} partNumber={part?.partNumber} models={models} />
      </div>
    </section>
  )
}
