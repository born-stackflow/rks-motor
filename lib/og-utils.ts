// Utility functions for generating dynamic OG images

export interface OGImageParams {
  title: string
  subtitle?: string
  type?: 'general' | 'model' | 'part' | 'news' | 'page'
  price?: string
  specs?: string
  category?: string
}

export function generateOGImageUrl(params: OGImageParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = new URL('/api/og', baseUrl)
  
  // Add parameters to URL
  url.searchParams.set('title', params.title)
  
  if (params.subtitle) {
    url.searchParams.set('subtitle', params.subtitle)
  }
  
  if (params.type) {
    url.searchParams.set('type', params.type)
  }
  
  if (params.price) {
    url.searchParams.set('price', params.price)
  }
  
  if (params.specs) {
    url.searchParams.set('specs', params.specs)
  }
  
  if (params.category) {
    url.searchParams.set('category', params.category)
  }
  
  return url.toString()
}

// Predefined OG images for common pages
export const defaultOGImages = {
  homepage: {
    title: 'RKS',
    subtitle: 'Premium Italian Motorcycles Since 1985',
    type: 'general' as const
  },
  
  models: {
    title: 'Motorcycle Models',
    subtitle: 'Discover Our Complete Range',
    type: 'general' as const
  },
  
  parts: {
    title: 'Parts & Accessories',
    subtitle: 'Genuine RKS Components',
    type: 'parts' as const
  },
  
  about: {
    title: 'About RKS',
    subtitle: 'Italian Heritage & Innovation',
    type: 'page' as const
  },
  
  dealers: {
    title: 'Find Dealers',
    subtitle: 'Authorized RKS Network',
    type: 'page' as const
  },
  
  news: {
    title: 'Latest News',
    subtitle: 'Updates & Announcements',
    type: 'news' as const
  },
  
  prices: {
    title: 'Motorcycle Prices',
    subtitle: 'Transparent Pricing & Financing',
    type: 'page' as const
  },
  
  media: {
    title: 'Media Center',
    subtitle: 'Press Resources & Assets',
    type: 'page' as const
  },
  
  contact: {
    title: 'Contact Us',
    subtitle: 'Sales & Support',
    type: 'page' as const
  },
  
  trade: {
    title: 'Trade Program',
    subtitle: 'Become an Authorized Dealer',
    type: 'page' as const
  }
}

// Generate OG image for specific motorcycle model
export function generateModelOGImage(model: {
  name: string
  category: string
  price?: number
  engine?: string
}) {
  return generateOGImageUrl({
    title: model.name,
    subtitle: `${model.category} Series`,
    type: 'model',
    price: model.price ? `€${model.price.toLocaleString()}` : undefined,
    specs: model.engine || undefined
  })
}

// Generate OG image for specific part
export function generatePartOGImage(part: {
  name: string
  category: string
  price?: number
  partNumber?: string
}) {
  return generateOGImageUrl({
    title: part.name,
    subtitle: part.category,
    type: 'part',
    price: part.price ? `€${part.price.toLocaleString()}` : undefined,
    specs: part.partNumber || undefined
  })
}

// Generate OG image for news article
export function generateNewsOGImage(article: {
  title: string
  category: string
  publishDate?: string
}) {
  return generateOGImageUrl({
    title: article.title,
    subtitle: `${article.category} News`,
    type: 'news'
  })
}

// Generate OG image for search results
export function generateSearchOGImage(query: string, resultCount: number) {
  return generateOGImageUrl({
    title: `Search: ${query}`,
    subtitle: `${resultCount} results found`,
    type: 'general'
  })
}

// Generate OG image for comparison
export function generateCompareOGImage(modelNames: string[]) {
  const title = modelNames.length > 0 
    ? `Compare ${modelNames.join(' vs ')}`
    : 'Compare Motorcycles'
    
  return generateOGImageUrl({
    title,
    subtitle: 'Side-by-side Comparison',
    type: 'general'
  })
}