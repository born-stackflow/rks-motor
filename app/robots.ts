import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/sanity/',
        '/studio/',
        '/admin/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: 'https://rks.com/sitemap.xml',
  }
}