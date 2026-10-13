import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { getSiteSettings } from '@/lib/sanity/data'
import { downloadsQuery, pressReleasesQuery } from '@/lib/sanity/queries'
import type { DownloadAsset, PostCard } from '@/lib/sanity/types'
import { MediaView } from '@/features/media/MediaView'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Media centre',
  description: 'Press releases, brochures, manuals and brand materials for Ape Ryder, RKS and Skyjet e-bikes.',
  alternates: { canonical: '/media' },
}

export default async function MediaPage() {
  const [pressReleases, downloads, settings] = await Promise.all([
    sanityFetchSafe<PostCard[]>(pressReleasesQuery, {}, []),
    sanityFetchSafe<DownloadAsset[]>(downloadsQuery, {}, []),
    getSiteSettings(),
  ])

  return (
    <MediaView
      pressReleases={pressReleases}
      downloads={downloads.filter((asset) => !!asset.fileUrl)}
      heroImage={settings?.pageBackgrounds?.news ?? null}
    />
  )
}
