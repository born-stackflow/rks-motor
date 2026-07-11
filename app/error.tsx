'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icon'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        {/* Error visual */}
        <p
          className="text-red leading-none mb-4"
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(5rem, 18vw, 12rem)', opacity: 0.12, letterSpacing: '0.05em' }}
        >
          ERR
        </p>

        <div className="-mt-10 relative z-10">
          <h1
            className="text-off-white leading-none mb-4"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Something Went Wrong
          </h1>
          <div className="h-[3px] w-[60px] bg-red mx-auto mb-6" />
          <p className="text-light text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Our team has been notified. Refresh the page or contact our support team if the problem persists.
          </p>

          {/* Dev error info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-red/10 border border-red/30 text-left max-w-sm mx-auto">
              <p className="text-xs font-semibold text-red uppercase tracking-wider mb-2">Dev Error</p>
              <p className="text-xs text-light font-mono break-all">{error.message}</p>
              {error.digest && (
                <p className="text-xs text-mid mt-1">ID: {error.digest}</p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={reset} className="btn-primary">
              Try Again <ArrowRight className="h-4 w-4" />
            </button>
            <Link href="/" className="btn-secondary">
              Back to Homepage
            </Link>
            <Link href="/contact" className="btn-ghost text-xs">
              Contact Support
            </Link>
          </div>

          <p className="text-mid text-xs mt-8">
            <a href="mailto:support@rks.com" className="hover:text-red transition-colors">support@rks.com</a>
            {' · '}
            <a href="tel:+390212345678" className="hover:text-red transition-colors">+39 02 1234 5678</a>
          </p>
        </div>
      </div>
    </div>
  )
}
