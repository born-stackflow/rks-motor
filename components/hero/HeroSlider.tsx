'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight } from '@/components/ui/Icon'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { useLanguage } from '@/contexts/LanguageContext'

const Scene1 = dynamic(() => import('./slides/Slide1Scene'), { ssr: false })
const Scene2 = dynamic(() => import('./slides/Slide2Scene'), { ssr: false })
const Scene3 = dynamic(() => import('./slides/Slide3Scene'), { ssr: false })
const Scene4 = dynamic(() => import('./slides/Slide4Scene'), { ssr: false })
const Scene5 = dynamic(() => import('./slides/Slide5Scene'), { ssr: false })

const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5]
const DURATION = 6000

interface HeroSliderProps {
  cmsBgs?: (string | undefined)[]
  cmsFgs?: (string | undefined)[]
}

export function HeroSlider({ cmsBgs = [], cmsFgs = [] }: HeroSliderProps) {
  const { t } = useLanguage()
  const slides = t.hero.slides as typeof t.hero.slides

  const [current, setCurrent] = useState(0)
  const [playing, setPlaying]  = useState(true)
  const [progress, setProgress] = useState(0)
  const [low, setLow] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setLow((navigator.hardwareConcurrency ?? 4) <= 2)
    }
  }, [])

  const go = useCallback((idx: number) => {
    setCurrent((idx + slides.length) % slides.length)
    setProgress(0)
  }, [slides.length])

  const next = useCallback(() => { go(current + 1); setPlaying(false) }, [current, go])
  const prev = useCallback(() => { go(current - 1); setPlaying(false) }, [current, go])

  useEffect(() => {
    if (!playing) return
    setProgress(0)
    const start = Date.now()
    const tick = setInterval(() => {
      const pct = ((Date.now() - start) / DURATION) * 100
      setProgress(Math.min(pct, 100))
      if (pct >= 100) {
        setCurrent((c) => (c + 1) % slides.length)
        setProgress(0)
      }
    }, 50)
    return () => clearInterval(tick)
  }, [current, playing, slides.length])

  const slide = slides[current]
  const Scene = SCENES[current]
  const bgSrc = cmsBgs[current]
  const fgSrc = cmsFgs[current]

  return (
    <section
      className="relative h-screen min-h-[600px] overflow-hidden bg-black"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
    >
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
        >
          {bgSrc ? (
            <Image
              src={bgSrc}
              alt={slide.headline.join(' ')}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <ImagePlaceholder />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Foreground: CMS product image OR 3D scene */}
      <AnimatePresence mode="wait">
        {fgSrc ? (
          <motion.div
            key={`fg-${current}`}
            className="absolute inset-y-0 right-0 w-1/2 pointer-events-none flex items-end justify-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative w-full h-full max-w-[640px]"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
            >
              <Image
                src={fgSrc}
                alt={slide.headline.join(' ')}
                fill
                sizes="(min-width: 1280px) 640px, 50vw"
                className="object-contain object-bottom drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                priority
              />
            </motion.div>
          </motion.div>
        ) : (
          !low && (
            <Suspense fallback={null}>
              <div key={`3d-${current}`} className="absolute inset-0 pointer-events-none">
                <Scene />
              </div>
            </Suspense>
          )
        )}
      </AnimatePresence>

      {/* Text content */}
      <div className="relative h-full container flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-5"
            >
              {slide.tag}
            </motion.p>

            <h1
              className="text-off-white leading-none mb-6"
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                letterSpacing: '0.02em',
              }}
            >
              {slide.headline[0]}
              <br />
              <span className="text-red">{slide.headline[1]}</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-light text-lg md:text-xl max-w-md mb-10 leading-relaxed"
            >
              {slide.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href={slide.cta.href} className="btn-primary">
                {slide.cta.label}
              </Link>
              <Link href={slide.ctaSec.href} className="btn-secondary">
                {slide.ctaSec.label}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 container flex items-end justify-between">
        <div className="flex items-center gap-6">
          <span
            className="text-light text-lg"
            style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em' }}
          >
            <span className="text-red">{String(current + 1).padStart(2, '0')}</span>
            {' / '}
            {String(slides.length).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { go(i); setPlaying(false) }}
                className={`h-[3px] transition-all duration-300 ${i === current ? 'w-6 bg-red' : 'w-2 bg-light/40 hover:bg-light/70'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-12 h-12 bg-dark-2/80 hover:bg-red flex items-center justify-center text-off-white border border-dark-3 hover:border-red transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="w-12 h-12 bg-dark-2/80 hover:bg-red flex items-center justify-center text-off-white border border-dark-3 hover:border-red transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-dark-3">
        <div
          className="h-full bg-red transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce hidden md:flex">
        <span className="text-[10px] text-mid uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-mid to-transparent" />
      </div>
    </section>
  )
}
