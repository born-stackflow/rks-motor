'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Building2, Calendar, MapPin, Package, X } from '@/components/ui/Icon'
import { useMessages } from '@/lib/i18n/LanguageContext'
import { EICMA, type EicmaPhase } from './event'
import { eicmaMessages } from './messages'
import styles from './eicma.module.css'

type Props = { phase: Exclude<EicmaPhase, { kind: 'after' }>; onClose: () => void }

export default function EicmaPopup({ phase, onClose }: Props) {
  const m = useMessages(eicmaMessages)
  const ref = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [])

  const rows = [
    { icon: Calendar, label: m.when, value: m.whenValue },
    { icon: MapPin, label: m.where, value: m.whereValue },
    { icon: Building2, label: m.hall, value: '22' },
    { icon: Package, label: m.booth, value: m.boothValue },
  ]

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={m.dialogLabel}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.card}>
        <div className={styles.poster}>
          <Image
            src={EICMA.poster}
            alt={m.posterAlt}
            fill
            sizes="(max-width: 767px) 92vw, 392px"
            quality={75}
            loading="eager"
            fetchPriority="high"
            className={styles.posterImg}
          />
        </div>

        <div className={styles.panel}>
          <span className={styles.chip}>{phase.kind === 'before' ? m.countdown(phase.days) : m.during}</span>
          <p className={styles.eyebrow}>{m.eyebrow}</p>
          <h2 className={styles.title}>{m.title}</h2>
          <p className={styles.sub}>{m.sub}</p>

          <dl className={styles.info}>
            {rows.map(({ icon: IconCmp, label, value }) => (
              <div key={label} className={styles.row}>
                <IconCmp className={styles.icon} />
                <div>
                  <dt className={styles.key}>{label}</dt>
                  <dd className={styles.value}>{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <button ref={closeRef} type="button" onClick={onClose} className={styles.close} aria-label={m.close}>
          <X className="h-5 w-5" />
        </button>
      </div>
    </dialog>
  )
}
