import 'server-only'
import { cache } from 'react'
import { sanityFetchSafe } from './fetch'
import { navModelsQuery, settingsQuery } from './queries'
import type { ModelNavItem, SiteSettings } from './types'

export const getSiteSettings = cache(() => sanityFetchSafe<SiteSettings | null>(settingsQuery, {}, null))

export const getNavModels = cache(() => sanityFetchSafe<ModelNavItem[]>(navModelsQuery, {}, []))
