import { SiteShell } from '@/components/layout/SiteShell'
import { StatusPage } from '@/components/layout/StatusPage'

export default function NotFound() {
  return (
    <SiteShell>
      <StatusPage kind="notFound" />
    </SiteShell>
  )
}
