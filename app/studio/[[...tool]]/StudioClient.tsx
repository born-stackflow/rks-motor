'use client'

import { useState, useEffect } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

type CmsLocale = 'en' | 'it'

const brandCss = `
  /* ── RKS Brand — Sanity Studio UI Polish ── */

  /* Font smoothing */
  * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

  /* Thin branded scrollbars */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #374151; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #dc2626; }

  /* Accent colour — override @sanity/ui primary blue → RKS red */
  [data-scheme="dark"] [data-tone="primary"][data-ui="Card"],
  [data-scheme="dark"] [data-selected="true"],
  [data-scheme="dark"] [aria-selected="true"],
  [data-scheme="dark"] [aria-current="true"] {
    --card-bg-color: rgba(220, 38, 38, 0.12) !important;
    --card-fg-color: #f87171 !important;
    --card-border-color: rgba(220, 38, 38, 0.25) !important;
    --card-muted-fg-color: #fca5a5 !important;
    --card-accent-fg-color: #dc2626 !important;
  }

  [data-scheme="light"] [data-tone="primary"][data-ui="Card"],
  [data-scheme="light"] [data-selected="true"],
  [data-scheme="light"] [aria-selected="true"] {
    --card-bg-color: rgba(220, 38, 38, 0.07) !important;
    --card-fg-color: #dc2626 !important;
    --card-border-color: rgba(220, 38, 38, 0.2) !important;
    --card-accent-fg-color: #dc2626 !important;
  }

  /* Focus rings → red */
  :focus-visible { outline-color: #dc2626 !important; }
  [data-ui="Button"][data-tone="primary"],
  [data-ui="Button"][data-selected="true"] {
    --card-bg-color: #dc2626 !important;
    --card-fg-color: #ffffff !important;
    --card-border-color: #b91c1c !important;
  }

  /* Navbar title area — subtle red underline on active tool */
  [data-ui="NavbarButton"][aria-selected="true"]::after,
  [role="tab"][aria-selected="true"]::after {
    background: #dc2626 !important;
  }

  /* Smooth all transitions */
  [data-ui] { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; }

  /* Better empty-state typography */
  [data-ui="Card"] p { line-height: 1.65; }

  /* Tighter sidebar list items */
  [data-ui="LayerManager"] nav li { letter-spacing: -0.01em; }

  /* Better form field focus */
  [data-ui="TextInput"]:focus-within,
  [data-ui="TextArea"]:focus-within {
    --card-border-color: #dc2626 !important;
    box-shadow: 0 0 0 1px #dc262640 !important;
  }

  /* Improved table row hover */
  [data-ui="Table"] tr:hover td {
    background: rgba(220,38,38,0.04) !important;
  }
`

/* ─── Floating language toggle ───────────────────────────────── */
function LangFloater() {
  const [locale, setLocale] = useState<CmsLocale>('en')
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rks-cms-locale') as CmsLocale | null
      if (saved === 'en' || saved === 'it') setLocale(saved)
    } catch {}
  }, [])

  const switchTo = (next: CmsLocale) => {
    if (next === locale) return
    try { localStorage.setItem('rks-cms-locale', next) } catch {}
    window.location.reload()
  }

  const nextLocale: CmsLocale = locale === 'en' ? 'it' : 'en'
  const nextLabel  = locale === 'en' ? 'Italiano' : 'English'
  const nextFlag   = locale === 'en' ? '🇮🇹' : '🇬🇧'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Expanded label — shows on hover */}
      {hovered && (
        <div style={{
          background: 'rgba(17,24,39,0.96)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 11,
          color: '#9ca3af',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
        }}>
          {locale === 'en' ? 'Switch to Italian' : 'Passa all\'italiano'}
          {' '}→ <strong style={{ color: '#f3f4f6' }}>{nextLocale.toUpperCase()}</strong>
        </div>
      )}

      {/* Main pill button */}
      <button
        onClick={() => switchTo(nextLocale)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={`${nextFlag} ${nextLabel}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: 0,
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: hovered
            ? '0 6px 24px rgba(220,38,38,0.35)'
            : '0 4px 16px rgba(0,0,0,0.45)',
          transition: 'box-shadow 0.2s',
          background: 'transparent',
        }}
      >
        {/* EN pill */}
        <span style={{
          padding: '9px 13px',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          background: locale === 'en' ? '#dc2626' : 'rgba(17,24,39,0.92)',
          color: locale === 'en' ? '#ffffff' : '#6b7280',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.25s, color 0.25s',
        }}>
          EN
        </span>

        {/* Divider */}
        <span style={{
          width: 1,
          alignSelf: 'stretch',
          background: 'rgba(255,255,255,0.10)',
        }} />

        {/* IT pill */}
        <span style={{
          padding: '9px 13px',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
          background: locale === 'it' ? '#dc2626' : 'rgba(17,24,39,0.92)',
          color: locale === 'it' ? '#ffffff' : '#6b7280',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.25s, color 0.25s',
        }}>
          IT
        </span>
      </button>

      {/* "CMS Language" micro-label */}
      <span style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: '#4b5563',
        textTransform: 'uppercase',
        textAlign: 'center',
        width: '100%',
        pointerEvents: 'none',
      }}>
        CMS Language
      </span>
    </div>
  )
}

/* ─── Studio client ──────────────────────────────────────────── */
export default function StudioClient() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: brandCss }} />
      <NextStudio config={config} scheme="dark" />
      <LangFloater />
    </>
  )
}
