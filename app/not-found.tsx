import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Icon'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        {/* 404 */}
        <p
          className="text-red leading-none mb-4"
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(6rem, 20vw, 14rem)', opacity: 0.15, letterSpacing: '0.05em' }}
        >
          404
        </p>

        <div className="-mt-12 relative z-10">
          <h1
            className="text-off-white leading-none mb-4"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
          >
            Page Not Found
          </h1>
          <div className="h-[3px] w-[60px] bg-red mx-auto mb-6" />
          <p className="text-light text-base leading-relaxed mb-10 max-w-sm mx-auto">
            The page you're looking for doesn't exist or may have moved. Let's get you back on track.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8">
            {[
              { label: 'Models',    href: '/models'  },
              { label: 'Parts',     href: '/parts'   },
              { label: 'Dealers',   href: '/dealers' },
              { label: 'Contact',   href: '/contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-3 bg-dark border border-dark-3 hover:border-red text-off-white hover:text-red text-sm font-semibold uppercase tracking-wider transition-all group"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Back to Homepage <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/models" className="btn-secondary">
              Browse Motorcycles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
