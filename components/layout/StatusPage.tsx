'use client'

import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icon'
import { useMessages } from '@/contexts/LanguageContext'
import { defineMessages } from '@/lib/i18n/define'

const messages = defineMessages({
  en: {
    notFound: {
      code: '404',
      title: 'Page not found',
      text: 'The page you are looking for does not exist or has moved.',
    },
    error: {
      code: 'ERR',
      title: 'Something went wrong',
      text: 'The page could not be loaded. Try again in a moment or get in touch with us.',
    },
    retry: 'Try again',
    home: 'Back to homepage',
    links: { models: 'Models', parts: 'Parts', dealers: 'Dealers', contact: 'Contact' },
  },
  it: {
    notFound: {
      code: '404',
      title: 'Pagina non trovata',
      text: 'La pagina che cerchi non esiste o è stata spostata.',
    },
    error: {
      code: 'ERR',
      title: 'Qualcosa è andato storto',
      text: 'Non è stato possibile caricare la pagina. Riprova tra poco o contattaci.',
    },
    retry: 'Riprova',
    home: 'Torna alla home',
    links: { models: 'Modelli', parts: 'Ricambi', dealers: 'Rivenditori', contact: 'Contatti' },
  },
})

export function StatusPage({ kind, onRetry }: { kind: 'notFound' | 'error'; onRetry?: () => void }) {
  const m = useMessages(messages)
  const copy = m[kind]

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-xl">
        <p className="font-display text-red leading-none mb-4 text-[clamp(6rem,20vw,14rem)] opacity-15 tracking-[0.05em]">
          {copy.code}
        </p>
        <div className="-mt-12 relative z-10">
          <h1 className="font-display text-off-white leading-none mb-4 text-[clamp(2.5rem,6vw,4rem)]">{copy.title}</h1>
          <div className="h-[3px] w-[60px] bg-red mx-auto mb-6" />
          <p className="text-light leading-relaxed mb-10 max-w-sm mx-auto">{copy.text}</p>
          {kind === 'notFound' ? (
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8">
              {(
                [
                  ['models', '/models'],
                  ['parts', '/parts'],
                  ['dealers', '/dealers'],
                  ['contact', '/contact'],
                ] as const
              ).map(([key, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-4 py-3 bg-dark border border-dark-3 hover:border-red text-off-white hover:text-red text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                  {m.links[key]}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry ? (
              <button type="button" onClick={onRetry} className="btn-primary">
                {m.retry} <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}
            <Link href="/" className={onRetry ? 'btn-secondary' : 'btn-primary'}>
              {m.home}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
