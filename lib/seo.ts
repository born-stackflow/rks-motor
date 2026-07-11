// SEO utilities and structured data for RKS website

export interface SEOData {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  structuredData?: any
}

export const defaultSEO: SEOData = {
  title: 'RKS | Premium Italian Motorcycles',
  description: 'Discover RKS\'s premium range of Italian motorcycles. From sport bikes to adventure touring, experience Italian craftsmanship and cutting-edge performance.',
  keywords: 'RKS, Italian motorcycles, premium bikes, sport bikes, adventure motorcycles, motorcycle parts, Milan, Italy',
  canonical: 'https://rks.com',
  ogImage: '/images/rks-og.jpg'
}

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RKS",
  "legalName": "RKS S.r.l.",
  "url": "https://rks.com",
  "logo": "https://rks.com/logo.png",
  "description": "Premium Italian motorcycle manufacturer established in Milan in 1985",
  "foundingDate": "1985-01-01",
  "founders": [
    {
      "@type": "Person",
      "name": "Giorgio Rossi"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Via Milano 123",
    "addressLocality": "Milan",
    "postalCode": "20121",
    "addressCountry": "IT"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+39-02-1234-5678",
      "contactType": "customer service",
      "availableLanguage": ["Italian", "English"]
    },
    {
      "@type": "ContactPoint",
      "telephone": "+39-02-1234-5680",
      "contactType": "sales",
      "availableLanguage": ["Italian", "English"]
    }
  ],
  "sameAs": [
    "https://facebook.com/rks",
    "https://instagram.com/rks",
    "https://youtube.com/rks",
    "https://linkedin.com/company/rks"
  ],
  "industry": "Motorcycle Manufacturing",
  "numberOfEmployees": "500-1000",
  "areaServed": {
    "@type": "Place",
    "name": "Europe"
  }
})

export const generateProductSchema = (product: {
  name: string
  description: string
  price: number
  currency: string
  category: string
  engine: string
  power: string
  image?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "category": product.category,
  "brand": {
    "@type": "Brand",
    "name": "RKS"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "RKS S.r.l."
  },
  "image": product.image || "/images/default-motorcycle.jpg",
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency,
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "RKS"
    }
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Engine",
      "value": product.engine
    },
    {
      "@type": "PropertyValue",
      "name": "Power",
      "value": product.power
    }
  ],
  "vehicleEngine": {
    "@type": "EngineSpecification",
    "name": product.engine
  }
})

export const generateDealerSchema = (dealer: {
  name: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  website?: string
  coordinates?: { lat: number; lng: number }
}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": dealer.name,
  "url": dealer.website,
  "telephone": dealer.phone,
  "email": dealer.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": dealer.address,
    "addressLocality": dealer.city,
    "addressCountry": dealer.country
  },
  "geo": dealer.coordinates ? {
    "@type": "GeoCoordinates",
    "latitude": dealer.coordinates.lat,
    "longitude": dealer.coordinates.lng
  } : undefined,
  "openingHours": [
    "Mo-Fr 09:00-18:00",
    "Sa 09:00-17:00"
  ],
  "priceRange": "$$$",
  "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
  "currenciesAccepted": "EUR"
})

export const generateNewsArticleSchema = (article: {
  title: string
  excerpt: string
  author: string
  publishedDate: string
  category: string
  image?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": article.title,
  "description": article.excerpt,
  "image": article.image || "/images/default-news.jpg",
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "RKS",
    "logo": {
      "@type": "ImageObject",
      "url": "https://rks.com/logo.png"
    }
  },
  "datePublished": article.publishedDate,
  "dateModified": article.publishedDate,
  "mainEntityOfPage": {
    "@type": "WebPage"
  },
  "articleSection": article.category
})

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
})

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "RKS",
  "url": "https://rks.com",
  "description": "Premium Italian motorcycle manufacturer",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://rks.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
})

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})

// Utility function to inject structured data
export const injectStructuredData = (data: any) => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)
  }
}

// SEO metadata for specific pages
export const pageSEO = {
  home: {
    title: 'RKS | Premium Italian Motorcycles & Parts',
    description: 'Discover our premium range of motorcycles, genuine parts, and accessories. Italian craftsmanship meets cutting-edge technology since 1985.',
    keywords: 'RKS, Italian motorcycles, premium bikes, sport motorcycles, adventure bikes, motorcycle parts, Milan Italy',
  },
  models: {
    title: 'RKS Motorcycles | Complete Model Range',
    description: 'Explore our complete range of motorcycles including Sport, Naked, Adventure, and Touring series. Find your perfect RKS motorcycle.',
    keywords: 'RKS motorcycles, sport bikes, naked bikes, adventure motorcycles, touring bikes, Italian motorcycles',
  },
  parts: {
    title: 'RKS Parts & Accessories | Genuine Components',
    description: 'Genuine RKS parts and accessories for all models. Ensure peak performance with original manufacturer parts and expert technical support.',
    keywords: 'RKS parts, motorcycle parts, genuine parts, accessories, maintenance, technical support',
  },
  about: {
    title: 'About RKS | Italian Motorcycle Heritage Since 1985',
    description: 'Discover the story behind RKS. From our humble beginnings in Milan to becoming a leading premium motorcycle manufacturer.',
    keywords: 'RKS history, Italian motorcycles, motorcycle manufacturer, Milan, premium bikes, craftsmanship, heritage',
  },
  dealers: {
    title: 'RKS Dealers | Authorized Sales & Service Network',
    description: 'Find your local RKS dealer for sales, service, and genuine parts. Authorized dealer network across Europe with expert support.',
    keywords: 'RKS dealers, motorcycle dealers, authorized dealers, sales, service, parts, Europe',
  },
  news: {
    title: 'RKS News | Latest Updates & Press Releases',
    description: 'Stay informed about the latest RKS innovations, racing achievements, product launches, and company updates.',
    keywords: 'RKS news, press releases, motorcycle news, product launches, racing, updates',
  },
  prices: {
    title: 'RKS Prices | Motorcycle Pricing & Financing',
    description: 'Transparent pricing for all RKS motorcycles. Find the perfect bike for your budget with flexible financing options available.',
    keywords: 'RKS prices, motorcycle pricing, financing, payment plans, motorcycle costs',
  },
  media: {
    title: 'RKS Media Center | Press Resources & Brand Assets',
    description: 'Access RKS press materials, high-resolution images, brand assets, and media resources for journalists and partners.',
    keywords: 'RKS media, press kit, brand assets, motorcycle photos, press releases, logo download',
  },
  contact: {
    title: 'Contact RKS | Sales Enquiries & Customer Support',
    description: 'Get in touch with RKS for sales enquiries, technical support, and customer service. Find contact information for all departments.',
    keywords: 'RKS contact, customer service, sales enquiries, technical support, contact information',
  },
  trade: {
    title: 'RKS Trade Program | Become an Authorized Dealer',
    description: 'Join the RKS dealer network. Learn about our trade program, dealer requirements, and business opportunities.',
    keywords: 'RKS dealers, trade program, become dealer, business opportunities, dealer application',
  }
}