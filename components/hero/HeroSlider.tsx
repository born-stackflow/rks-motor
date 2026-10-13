'use client'

import { useCallback, useEffect, useRef, useState, type AnimationEvent, type FocusEvent } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { SanityImage, hasImage } from '@/components/sanity/SanityImage'
import { useMessages } from '@/contexts/LanguageContext'
import { homeMessages } from '@/lib/i18n/messages/home'
import type { Image } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'
import { useLowPowerDevice, usePrefersReducedMotion } from './useClientFlags'
import styles from './HeroSlider.module.css'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

export type HeroSlideMedia = { bg?: Image; fg?: Image }

type SliderState = { current: number; visited: number[]; changed: boolean }

const CONTROL =
  'flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border border-dark-3 bg-dark-2/80 text-off-white transition-colors duration-200 hover:border-red hover:bg-red'

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M7 4l13 8-13 8z" />
    </svg>
  )
}

export function HeroSlider({ media = [] }: { media?: HeroSlideMedia[] }) {
  const t = useMessages(homeMessages).hero
  const slides = t.slides
  const total = slides.length

  const [{ current, visited, changed }, setSlider] = useState<SliderState>({
    current: 0,
    visited: [0, 1 % total],
    changed: false,
  })
  const [stopped, setStopped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  const reducedMotion = usePrefersReducedMotion()
  const lowPower = useLowPowerDevice()

  const show = useCallback(
    (index: number) => {
      setSlider((prev) => {
        const next = (index + total) % total
        const upcoming = (next + 1) % total
        const seen = new Set([...prev.visited, next, upcoming])
        return { current: next, visited: [...seen], changed: true }
      })
    },
    [total],
  )

  const showManually = (index: number) => {
    show(index)
    setStopped(true)
  }

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const autoplay = !stopped && !reducedMotion
  const running = autoplay && !hovered && inView

  const handleProgressEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) show(current + 1)
  }

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target.matches(':focus-visible')) setStopped(true)
  }

  const slide = slides[current]
  const hasForeground = (index: number) => hasImage(media[index]?.fg)
  const use3d = !lowPower && !reducedMotion && slides.some((_, i) => !hasForeground(i))
  const show3d = use3d && !hasForeground(current)

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={t.label}
      className="relative h-svh min-h-[600px] overflow-hidden bg-black"
      onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setHovered(false)}
      onFocus={handleFocus}
    >
      {slides.map((_, i) =>
        visited.includes(i) ? (
          <div
            key={`bg-${i}`}
            aria-hidden="true"
            className={cn(
              'absolute inset-0 transition-opacity duration-700 ease-in-out',
              i === current ? 'opacity-100' : 'opacity-0',
            )}
          >
            {hasImage(media[i]?.bg) ? (
              <SanityImage
                image={media[i]?.bg}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        ) : null,
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {use3d ? (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-700',
            show3d ? 'opacity-100' : 'opacity-0',
          )}
        >
          <HeroScene index={current} active={show3d && inView} />
        </div>
      ) : null}

      {slides.map((_, i) =>
        visited.includes(i) && hasForeground(i) ? (
          <div
            key={`fg-${i}`}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 flex w-1/2 items-end justify-center transition-[opacity,translate] duration-700 ease-out motion-reduce:translate-none',
              i === current ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0',
            )}
          >
            <div className={cn('relative h-full w-full max-w-[640px]', i === current && styles.float)}>
              <SanityImage
                image={media[i]?.fg}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 1280px) 640px, 50vw"
                className="object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>
        ) : null,
      )}

      <div className="container relative flex h-full flex-col justify-center" aria-live={running ? 'off' : 'polite'}>
        <div
          key={current}
          role="group"
          aria-roledescription="slide"
          aria-label={t.slideOf(current + 1, total)}
          className="max-w-2xl pb-20"
        >
          <p
            className={cn('mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-red', changed && styles.reveal)}
          >
            {slide.tag}
          </p>
          <h1
            className={cn(
              'mb-6 font-display text-[clamp(3.25rem,10vw,9rem)] uppercase leading-none tracking-[0.02em] text-off-white',
              changed && styles.reveal,
            )}
            style={changed ? { animationDelay: '80ms' } : undefined}
          >
            {slide.headline}
            <br />
            <span className="text-red">{slide.accent}</span>
          </h1>
          <p
            className={cn('mb-10 max-w-md text-lg leading-relaxed text-light md:text-xl', changed && styles.reveal)}
            style={changed ? { animationDelay: '160ms' } : undefined}
          >
            {slide.sub}
          </p>
          <div
            className={cn('flex flex-col gap-3 sm:flex-row', changed && styles.reveal)}
            style={changed ? { animationDelay: '240ms' } : undefined}
          >
            <Link href={slide.cta.href} className="btn-primary">
              {slide.cta.label}
            </Link>
            <Link href={slide.ctaSec.href} className="btn-secondary">
              {slide.ctaSec.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="container absolute inset-x-0 bottom-5 flex items-end justify-between gap-4 sm:bottom-8">
        <div className="flex items-center gap-6">
          <span aria-hidden="true" className="hidden font-display text-lg tracking-[0.1em] text-light sm:inline">
            <span className="text-red">{String(current + 1).padStart(2, '0')}</span>
            {' / '}
            {String(total).padStart(2, '0')}
          </span>
          <div className="flex items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => showManually(i)}
                aria-label={t.goTo(i + 1)}
                aria-current={i === current ? 'true' : undefined}
                className="group flex h-10 w-8 items-center justify-center"
              >
                <span
                  className={cn(
                    'block h-[3px] transition-all duration-300',
                    i === current ? 'w-6 bg-red' : 'w-2 bg-light/40 group-hover:bg-light/70',
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {reducedMotion ? null : (
            <button
              type="button"
              onClick={() => setStopped((value) => !value)}
              aria-label={stopped ? t.play : t.pause}
              className={CONTROL}
            >
              {stopped ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
          <button type="button" onClick={() => showManually(current - 1)} aria-label={t.previous} className={CONTROL}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => showManually(current + 1)} aria-label={t.next} className={CONTROL}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-dark-3">
        {autoplay ? (
          <div
            key={current}
            className={styles.progress}
            style={{ animationPlayState: running ? 'running' : 'paused' }}
            onAnimationEnd={handleProgressEnd}
          />
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 motion-safe:animate-bounce md:flex"
      >
        <span className="text-[10px] uppercase tracking-widest text-light">{t.scroll}</span>
        <div className="h-8 w-px bg-gradient-to-b from-light to-transparent" />
      </div>
    </section>
  )
}
