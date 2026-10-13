'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { Check, Mail, Send } from '@/components/ui/Icon'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { useMessages } from '@/contexts/LanguageContext'
import { newsMessages } from '@/lib/i18n/messages/news'

type CopyStatus = 'idle' | 'copied' | 'failed'

function LinkedInIcon({ className }: { className?: string }) {
  return <SocialIcon network="linkedin" className={className} />
}

function XIcon({ className }: { className?: string }) {
  return <SocialIcon network="twitter" className={className} />
}

export function ShareBar({ url, title }: { url: string; title: string }) {
  const m = useMessages(newsMessages).article
  const [status, setStatus] = useState<CopyStatus>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 3000)
    return () => window.clearTimeout(timer)
  }, [status])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const targets: Array<{ name: string; href: string; icon: ComponentType<{ className?: string }>; external: boolean }> = [
    {
      name: m.email,
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title}\n\n${url}`)}`,
      icon: Mail,
      external: false,
    },
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: Send, external: true },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedInIcon,
      external: true,
    },
    { name: 'X', href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`, icon: XIcon, external: true },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-light mr-1">{m.share}</p>
      <button type="button" onClick={copy} className="btn-secondary h-10 px-4 py-0 text-xs">
        {status === 'copied' ? <Check className="h-4 w-4 text-red" /> : null}
        {m.copyLink}
      </button>
      <ul className="flex flex-wrap gap-2">
        {targets.map(({ name, href, icon: IconCmp, external }) => (
          <li key={name}>
            <a
              href={href}
              aria-label={m.shareVia(name)}
              title={m.shareVia(name)}
              className="flex h-10 w-10 items-center justify-center border border-dark-3 text-light transition-colors hover:border-red hover:text-off-white"
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <IconCmp className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite" className="w-full text-xs text-light sm:w-auto">
        {status === 'copied' ? m.copied : status === 'failed' ? m.copyFailed : ''}
      </p>
    </div>
  )
}
