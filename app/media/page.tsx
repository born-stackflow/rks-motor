import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Download, ArrowRight } from '@/components/ui/Icon'
import { formatDate } from '@/lib/utils'
import { sanityClient, queries, urlFor } from '@/lib/sanity'
import type { BlogPostCard, DownloadAsset } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Media Center | RKS E-Bikes Press Resources',
  description: 'Access RKS E-Bikes press releases, brochures, spec sheets, brand assets, and media resources.',
}

export const revalidate = 60

const TYPE_LABELS: Record<string, string> = {
  brochure:         'Brochure',
  specsheet:        'Spec Sheet',
  presskit:         'Press Kit',
  manual:           'User Manual',
  pricelist:        'Price List',
  'parts-catalogue':'Parts Catalogue',
  'brand-asset':    'Brand Asset',
}

const TYPE_BADGE: Record<string, 'red' | 'gold' | 'green' | 'amber' | 'dark'> = {
  brochure: 'red', specsheet: 'amber', presskit: 'gold',
  manual: 'dark', pricelist: 'green', 'parts-catalogue': 'dark', 'brand-asset': 'dark',
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80'

function postSlug(post: BlogPostCard) {
  return (post.slug as any)?.current ?? ''
}

function thumbUrl(img: any, w = 600, h = 340): string {
  if (img?.asset) return urlFor(img).width(w).height(h).quality(80).url()
  return FALLBACK_IMG
}

export default async function MediaPage() {
  const [pressReleases, allDownloads] = await Promise.all([
    sanityClient.fetch<BlogPostCard[]>(queries.pressReleases).catch(() => []),
    sanityClient.fetch<DownloadAsset[]>(queries.allDownloads).catch(() => []),
  ])

  const downloads   = allDownloads.filter(d => d.type !== 'brand-asset')
  const brandAssets = allDownloads.filter(d => d.type === 'brand-asset')

  return (
    <div className="min-h-screen bg-black">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative h-[40vh] min-h-[260px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=90"
          alt="Media Center"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">Press & Media</p>
            <h1
              className="text-off-white leading-none mb-2"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.02em' }}
            >
              Media Center
            </h1>
            <div className="h-[3px] w-[60px] bg-red" />
          </div>
        </div>
      </section>

      <div className="container py-12">

        {/* ── Press Releases ──────────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeading tag="Latest" title="Press Releases" />

          {pressReleases.length === 0 ? (
            <div className="mt-10 p-10 border border-dark-3 bg-dark text-center">
              <p className="text-mid text-sm">No press releases yet.</p>
              <p className="text-mid text-xs mt-1">
                Add blog posts with category <span className="text-off-white">Press</span> in Sanity Studio → News & Blog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {pressReleases.map(pr => (
                <div key={pr._id} className="group card overflow-hidden flex flex-col hover:border-red transition-colors">
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <Image
                      src={thumbUrl(pr.featuredImage, 600, 260)}
                      alt={pr.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="red">Press Release</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-mid mb-2">{formatDate(pr.publishedDate)}</p>
                    <h3 className="text-off-white font-bold text-base mb-2 leading-snug group-hover:text-red transition-colors">
                      {pr.title}
                    </h3>
                    <p className="text-light text-sm leading-relaxed flex-1">{pr.excerpt}</p>
                    <div className="flex items-center gap-4 mt-5 pt-4 border-t border-dark-3">
                      <Link
                        href={`/news/${postSlug(pr)}`}
                        className="flex items-center gap-1 text-xs text-red hover:text-red/70 font-semibold uppercase tracking-wider transition-colors"
                      >
                        Read Release <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="h-px bg-dark-3 mb-16" />

        {/* ── Downloads ───────────────────────────────────────────── */}
        <section className="mb-16">
          <SectionHeading tag="Downloads" title="Brochures & Manuals" />

          {downloads.length === 0 ? (
            <div className="mt-10 p-10 border border-dark-3 bg-dark text-center">
              <p className="text-mid text-sm">No downloads yet.</p>
              <p className="text-mid text-xs mt-1">
                Upload PDFs in Sanity Studio → <span className="text-off-white">Media & Downloads</span>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {downloads.map(d => (
                <div key={d._id} className="group card overflow-hidden hover:border-red transition-colors">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={thumbUrl(d.thumbnail, 600, 338)}
                      alt={d.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    {d.language && (
                      <div className="absolute top-3 right-3">
                        <span className="badge bg-dark-3 text-light border border-dark-3 text-[10px] uppercase">
                          {d.language}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant={TYPE_BADGE[d.type] ?? 'dark'}>
                        {TYPE_LABELS[d.type] ?? d.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-off-white font-bold text-sm truncate group-hover:text-red transition-colors">
                        {d.title}
                      </h4>
                      {d.fileSize && <p className="text-mid text-xs mt-0.5">{d.fileSize}</p>}
                      {d.model?.name && <p className="text-mid text-xs">{d.model.name}</p>}
                    </div>
                    {d.fileUrl ? (
                      <a
                        href={d.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 w-9 h-9 bg-dark-3 hover:bg-red flex items-center justify-center text-light hover:text-white transition-all duration-200"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    ) : (
                      <div className="shrink-0 w-9 h-9 bg-dark-3/50 flex items-center justify-center text-mid">
                        <Download className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="h-px bg-dark-3 mb-16" />

        {/* ── Brand Assets ────────────────────────────────────────── */}
        <section>
          <SectionHeading
            tag="Identity"
            title="Brand Assets"
            subtitle="For press, partners, and authorised use only. Contact us for licensing enquiries."
          />

          {brandAssets.length === 0 ? (
            <div className="mt-10 p-10 border border-dark-3 bg-dark text-center">
              <p className="text-mid text-sm">No brand assets uploaded yet.</p>
              <p className="text-mid text-xs mt-1">
                Upload logos and guides in Sanity Studio → <span className="text-off-white">Media & Downloads</span> → type: <span className="text-off-white">Brand Asset</span>.
              </p>
            </div>
          ) : (
            <div className="mt-10 border border-dark-3 divide-y divide-dark-3">
              {brandAssets.map((asset) => (
                <div
                  key={asset._id}
                  className="flex items-center justify-between p-5 hover:bg-dark transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red/10 border border-red/20 flex items-center justify-center shrink-0">
                      <Download className="h-4 w-4 text-red" />
                    </div>
                    <div>
                      <p className="text-off-white font-semibold text-sm group-hover:text-red transition-colors">
                        {asset.title}
                      </p>
                      <p className="text-mid text-xs mt-0.5">
                        {TYPE_LABELS[asset.type] ?? asset.type}
                        {asset.fileSize ? ` · ${asset.fileSize}` : ''}
                      </p>
                    </div>
                  </div>
                  {asset.fileUrl ? (
                    <a
                      href={asset.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold uppercase tracking-wider text-light hover:text-off-white border border-dark-3 hover:border-red px-4 py-2 transition-all"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-mid px-4 py-2">No file</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Press contact ────────────────────────────────────────── */}
        <div className="mt-16 p-8 md:p-10 border-l-4 border-red bg-dark">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red mb-3">Media Enquiries</p>
          <h3 className="text-3xl text-off-white mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            Contact Our Press Team
          </h3>
          <p className="text-light text-sm max-w-xl mb-6">
            For interview requests, high-resolution images, or specific press materials not listed above,
            contact our media relations team directly.
          </p>
          <Link href="/contact?type=press" className="btn-primary inline-flex items-center gap-2">
            Media Contact Form <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
