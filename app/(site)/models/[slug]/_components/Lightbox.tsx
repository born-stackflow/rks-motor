'use client'

import { useEffect, useRef } from 'react'
import { SanityImage } from '@/components/sanity/SanityImage'
import { X } from '@/components/ui/Icon'
import type { Image } from '@/lib/sanity/types'

type Props = {
  image: Image | null
  alt: string
  label: string
  closeLabel: string
  onClose: () => void
}

export function Lightbox({ image, alt, label, closeLabel, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (image && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
    } else if (!image && dialog.open) {
      dialog.close()
    }
  }, [image])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={() => {
        returnFocus.current?.focus()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close()
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-transparent p-4 backdrop:bg-black/95 open:flex"
    >
      <button
        type="button"
        autoFocus
        onClick={() => ref.current?.close()}
        aria-label={closeLabel}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-dark-3 bg-dark-2 text-light transition-colors hover:text-red"
      >
        <X className="h-5 w-5" />
      </button>
      {image ? (
        <div className="relative aspect-[16/10] w-full max-w-5xl">
          <SanityImage image={image} alt={alt} fill sizes="(max-width: 1100px) 100vw, 1024px" className="object-contain" />
        </div>
      ) : null}
    </dialog>
  )
}
