import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ── GROQ Queries ──────────────────────────────────────────────────────────────

export const queries = {

  // Bike Models
  featuredModels: `*[_type == "bikeModel" && isFeatured == true] | order(order asc, name asc) [0...6] {
    _id, name, slug, category, tagline, price, isNew, isFeatured, availability,
    heroImage, features
  }`,

  allModels: `*[_type == "bikeModel"] | order(order asc, name asc) {
    _id, name, slug, category, tagline, price, isNew, isFeatured, availability,
    heroImage,
    "thumbnailImage": coalesce(colours[0].image, heroImage),
    features,
    "motor": specs.motor,
    "maxSpeed": specs.maxSpeed,
    "range": specs.range,
    "battery": specs.battery
  }`,

  modelBySlug: `*[_type == "bikeModel" && slug.current == $slug][0] {
    _id, name, slug, category, tagline, price, b2cPriceNote, isNew, availability,
    heroImage, hotspotImage, gallery, colours, specs, features,
    keyFeatures[] { title, description, image },
    description,
    hotspots,
    specSheetPDF,
    "sameBrandModels": *[_type == "bikeModel" && category == ^.category && slug.current != ^.slug.current] | order(order asc, name asc) [0...4] {
      _id, name, "slug": slug.current, category, price, tagline, isNew,
      heroImage,
      "thumbnailImage": coalesce(colours[0].image, heroImage)
    },
    metaTitle, metaDescription
  }`,

  modelSlugs: `*[_type == "bikeModel"] { "slug": slug.current }`,

  compareModels: `*[_type == "bikeModel"] | order(order asc, name asc) {
    _id, name, slug, category, tagline, price, availability,
    heroImage,
    "thumbnailImage": coalesce(colours[0].image, heroImage),
    specs, features
  }`,

  navModels: `*[_type == "bikeModel"] | order(order asc, name asc) {
    _id, name, "slug": slug.current, category,
    "heroImage": heroImage { asset, alt }
  }`,

  // Parts & Accessories
  featuredParts: `*[_type == "bikePart" && isFeatured == true] | order(name asc) [0...8] {
    _id, name, slug, partNumber, category, partType, retailPrice, availability,
    compatibleModels[]-> { name, slug },
    "image": images[0]
  }`,

  allParts: `*[_type == "bikePart"] | order(name asc) {
    _id, name, slug, partNumber, manufacturerPartNumber, category, partType,
    retailPrice, availability, isFeatured, soldAs,
    compatibleModels[]-> { name, slug },
    "image": images[0]
  }`,

  partBySlug: `*[_type == "bikePart" && slug.current == $slug][0] {
    _id, name, slug, partNumber, manufacturerPartNumber, replacesPartNumber,
    category, partType, retailPrice, availability, leadTime,
    soldAs, quantityInPackage, packageIncludes, warranty,
    description, images, dimensions, technicalSpecs, material,
    surfaceFinish, coating, fitmentNotes, yearRangeFrom, yearRangeTo,
    compatibleModels[]-> { name, slug, category, heroImage },
    metaTitle, metaDescription
  }`,

  partSlugs: `*[_type == "bikePart"] { "slug": slug.current }`,

  // One representative image + live count per part category, for the homepage teaser grid
  partCategorySummary: `{
    "motor": {
      "count": count(*[_type == "bikePart" && category == "motor"]),
      "image": *[_type == "bikePart" && category == "motor" && count(images) > 0] | order(name asc) [0].images[0]
    },
    "battery": {
      "count": count(*[_type == "bikePart" && category == "battery"]),
      "image": *[_type == "bikePart" && category == "battery" && count(images) > 0] | order(name asc) [0].images[0]
    },
    "brakes": {
      "count": count(*[_type == "bikePart" && category == "brakes"]),
      "image": *[_type == "bikePart" && category == "brakes" && count(images) > 0] | order(name asc) [0].images[0]
    },
    "accessories": {
      "count": count(*[_type == "bikePart" && category == "accessories"]),
      "image": *[_type == "bikePart" && category == "accessories" && count(images) > 0] | order(name asc) [0].images[0]
    }
  }`,

  // Blog / News
  latestPosts: `*[_type == "blogPost"] | order(publishedDate desc) [0...6] {
    _id, title, slug, excerpt, category, isFeatured, publishedDate, tags,
    featuredImage, author-> { name, photo, role }
  }`,

  allPosts: `*[_type == "blogPost"] | order(publishedDate desc) {
    _id, title, slug, excerpt, category, isFeatured, publishedDate, tags,
    featuredImage, author-> { name, photo, role }
  }`,

  postBySlug: `*[_type == "blogPost" && slug.current == $slug][0] {
    _id, title, slug, excerpt, category, publishedDate, tags,
    featuredImage, body, isFeatured,
    author-> { name, photo, bio, role, social },
    relatedModels[]-> { name, slug, heroImage },
    metaTitle, metaDescription
  }`,

  postSlugs: `*[_type == "blogPost"] { "slug": slug.current }`,

  // Dealers
  allDealers: `*[_type == "dealer" && isActive != false] | order(country asc, city asc) {
    _id, name, slug, type, address, city, region, country,
    phone, email, website, latitude, longitude, googleMapsUrl,
    hours, services, languages, logo
  }`,

  // Team Members
  allTeam: `*[_type == "teamMember" && isVisible != false] | order(order asc) {
    _id, name, role, department, photo, bio, linkedin
  }`,

  // Milestones
  allMilestones: `*[_type == "milestone"] | order(year asc) {
    _id, year, title, description, category, isHighlight, image
  }`,

  // Downloads
  allDownloads: `*[_type == "downloadAsset"] | order(type asc, title asc) {
    _id, title, type, language, fileSize, publishedDate, isPublic,
    thumbnail, "fileUrl": file.asset->url, model-> { name, slug }
  }`,

  // Press releases = blog posts with category 'press'
  pressReleases: `*[_type == "blogPost" && category == "press"] | order(publishedDate desc) [0...6] {
    _id, title, slug, excerpt, publishedDate, tags,
    featuredImage, author-> { name }
  }`,

  downloadsByModel: `*[_type == "downloadAsset" && model._ref == $modelId] | order(type asc) {
    _id, title, type, language, fileSize, isPublic, thumbnail, file
  }`,

  // Trade FAQs
  tradeFAQs: `*[_type == "tradePageFAQ" && isVisible != false] | order(category asc, order asc) {
    _id, question, answer, category, order
  }`,

  // Site Settings
  siteSettings: `*[_type == "siteSettings"][0] {
    siteName, tagline, logo, logoDark,
    address, phone, email, salesEmail, tradeEmail, googleMapsUrl,
    socialLinks, statsBar, announcementBanner, footerText,
    metaTitle, metaDescription, ogImage, googleVerification,
    heroSlide1Fg, heroSlide2Fg, heroSlide3Fg, heroSlide4Fg, heroSlide5Fg,
    heroSlide1Bg, heroSlide2Bg, heroSlide3Bg, heroSlide4Bg, heroSlide5Bg,
    partsSectionBg, whySectionBg, b2bSectionBg, dealerSectionBg
  }`,
}

// ── TypeScript Types (aligned to schema fields) ───────────────────────────────

export type SlugRef = { slug: { current: string } }

export type BikeModelCard = {
  _id: string
  name: string
  slug: { current: string }
  category: string
  tagline?: string
  price?: number
  isNew?: boolean
  isFeatured?: boolean
  availability?: string
  heroImage?: SanityImageSource & { alt?: string }
  thumbnailImage?: SanityImageSource & { alt?: string }
  features?: string[]
  motor?: string
  maxSpeed?: number
  range?: string
  battery?: string
}

export type EBikeSpecs = {
  motor?: string
  maxSpeed?: number
  ridingModes?: string
  range?: string
  battery?: string
  chargingTime?: string
  displayPanel?: string
  frontLight?: string
  rearLight?: string
  frontFork?: string
  rearSuspension?: string
  brakes?: string
  tires?: string
  gearSystem?: string
  chainring?: string
  derailleur?: string
  frame?: string
  saddle?: string
  pedals?: string
  bag?: string
  fender?: string
  rearCarrier?: string
  weight?: string
}

export type KeyFeature = {
  title: string
  image?: SanityImageSource & { alt?: string }
  description?: string
}

export type FeatureHotspot = {
  label?: string
  title?: string
  description?: string
  highlight?: string
  x: number
  y: number
}

export type BikeModelFull = BikeModelCard & {
  hotspotImage?: SanityImageSource & { alt?: string }
  gallery?: Array<SanityImageSource & { alt?: string; caption?: string }>
  colours?: Array<{ name: string; hex?: string; image?: SanityImageSource }>
  specs?: EBikeSpecs
  description?: unknown[]
  keyFeatures?: KeyFeature[]
  hotspots?: FeatureHotspot[]
  b2cPriceNote?: string
  specSheetPDF?: { asset: { url: string } }
  sameBrandModels?: Array<{
    _id: string
    name: string
    slug: string
    category: string
    price?: number
    tagline?: string
    isNew?: boolean
    heroImage?: SanityImageSource & { alt?: string }
  }>
  metaTitle?: string
  metaDescription?: string
}

export type BikePartCard = {
  _id: string
  name: string
  slug: SlugRef
  partNumber: string
  category: string
  partType: string
  retailPrice?: number
  availability?: string
  isFeatured?: boolean
  soldAs?: string
  compatibleModels?: Array<{ name: string; slug: SlugRef }>
  image?: SanityImageSource & { alt?: string }
}

export type PartCategorySummary = Record<
  'motor' | 'battery' | 'brakes' | 'accessories',
  { count: number; image?: (SanityImageSource & { alt?: string }) | null }
>

export type BlogPostCard = {
  _id: string
  title: string
  slug: SlugRef
  excerpt: string
  category: string
  isFeatured?: boolean
  publishedDate: string
  tags?: string[]
  featuredImage?: SanityImageSource & { alt?: string }
  author?: { name: string; photo?: SanityImageSource; role?: string }
}

export type DownloadAsset = {
  _id: string
  title: string
  type: 'brochure' | 'specsheet' | 'presskit' | 'manual' | 'pricelist' | 'parts-catalogue' | 'brand-asset'
  language?: string
  fileSize?: string
  publishedDate?: string
  isPublic?: boolean
  fileUrl?: string
  thumbnail?: SanityImageSource
  model?: { name: string; slug: SlugRef }
}

export type Dealer = {
  _id: string
  name: string
  slug?: SlugRef
  type: 'dealer' | 'service' | 'both'
  address: string
  city: string
  region?: string
  country: string
  phone?: string
  email?: string
  website?: string
  latitude: number
  longitude: number
  googleMapsUrl?: string
  hours?: string
  services?: string[]
  languages?: string[]
  logo?: SanityImageSource
}

export type SiteSettings = {
  siteName: string
  tagline?: string
  logo?: SanityImageSource & { alt?: string }
  logoDark?: SanityImageSource
  address?: string
  phone?: string
  email?: string
  salesEmail?: string
  tradeEmail?: string
  googleMapsUrl?: string
  socialLinks?: Record<string, string>
  statsBar?: Array<{ value: string; label: string }>
  announcementBanner?: string
  footerText?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageSource
  googleVerification?: string
  // Hero foreground (product) images
  heroSlide1Fg?: SanityImageSource
  heroSlide2Fg?: SanityImageSource
  heroSlide3Fg?: SanityImageSource
  heroSlide4Fg?: SanityImageSource
  heroSlide5Fg?: SanityImageSource
  // Homepage background images
  heroSlide1Bg?: SanityImageSource
  heroSlide2Bg?: SanityImageSource
  heroSlide3Bg?: SanityImageSource
  heroSlide4Bg?: SanityImageSource
  heroSlide5Bg?: SanityImageSource
  partsSectionBg?: SanityImageSource
  whySectionBg?: SanityImageSource
  b2bSectionBg?: SanityImageSource
  dealerSectionBg?: SanityImageSource
}
