/**
 * Sanity Studio embedded at /studio
 * Access: yoursite.com/studio
 * Protected by Sanity's own auth — only team members with project access can log in.
 */
import StudioClient from './StudioClient'

export const dynamic = 'force-dynamic'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <StudioClient />
}
