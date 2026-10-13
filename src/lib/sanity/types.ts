import type { SanityImageSource } from '@sanity/image-url'
import type { PortableTextBlock } from '@portabletext/types'

export type Image = SanityImageSource & { alt?: string; caption?: string; color?: string }

export type Brand = 'aperyder' | 'rks' | 'skyjet'
export type ModelAvailability = 'in-stock' | 'pre-order' | 'coming-soon' | 'discontinued'
export type PartAvailability = 'in-stock' | 'order-required' | 'out-of-stock'
export type PartCategory =
  | 'motor'
  | 'battery'
  | 'brakes'
  | 'suspension'
  | 'electrical'
  | 'gears'
  | 'body'
  | 'tyres'
  | 'accessories'
export type PostCategory = 'news' | 'launches' | 'events' | 'press' | 'technology' | 'lifestyle'

export type ModelSpecs = {
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

export type ModelCard = {
  _id: string
  name: string
  slug: string
  brand: Brand
  tagline?: string
  price?: number
  isNew?: boolean
  isFeatured?: boolean
  availability?: ModelAvailability
  image?: Image
  features?: string[]
  motor?: string
  maxSpeed?: number
  range?: string
  battery?: string
}

export type ModelNavItem = {
  _id: string
  name: string
  slug: string
  brand: Brand
  image?: Image
}

export type KeyFeature = { title: string; description?: string; image?: Image }

export type Hotspot = {
  label?: string
  title?: string
  description?: string
  highlight?: string
  x: number
  y: number
}

export type ModelDetail = ModelCard & {
  b2cPriceNote?: string
  heroImage?: Image
  hotspotImage?: Image
  gallery?: Image[]
  colours?: Array<{ name: string; hex?: string; image?: Image }>
  specs?: ModelSpecs
  description?: PortableTextBlock[]
  keyFeatures?: KeyFeature[]
  hotspots?: Hotspot[]
  specSheetUrl?: string
  related?: ModelCard[]
  metaTitle?: string
  metaDescription?: string
}

export type CompareModel = ModelCard & { specs?: ModelSpecs }

export type PartCard = {
  _id: string
  name: string
  slug: string
  partNumber: string
  category: PartCategory
  partType: 'oem' | 'aftermarket' | 'accessory'
  retailPrice?: number
  availability?: PartAvailability
  isFeatured?: boolean
  soldAs?: 'single' | 'pair' | 'kit' | 'set'
  image?: Image
  compatibleModels?: Array<{ name: string; slug: string }>
}

export type PartDetail = Omit<PartCard, 'compatibleModels'> & {
  manufacturerPartNumber?: string
  replacesPartNumber?: string
  leadTime?: string
  quantityInPackage?: number
  packageIncludes?: string[]
  warranty?: string
  description?: PortableTextBlock[]
  images?: Image[]
  dimensions?: Record<string, string | number | undefined>
  technicalSpecs?: Record<string, string | number | undefined>
  material?: string
  surfaceFinish?: string
  coating?: string
  fitmentNotes?: string
  yearRangeFrom?: number
  yearRangeTo?: number
  compatibleModels?: Array<{ name: string; slug: string; brand: Brand; image?: Image }>
  related?: PartCard[]
  metaTitle?: string
  metaDescription?: string
}

export type PartCategorySummary = Array<{ category: PartCategory; count: number; image?: Image }>

export type Author = { name: string; photo?: Image; role?: string; bio?: string }

export type PostCard = {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: PostCategory
  isFeatured?: boolean
  publishedDate: string
  tags?: string[]
  image?: Image
  author?: Author
}

export type PostDetail = PostCard & {
  body?: PortableTextBlock[]
  relatedModels?: ModelCard[]
  metaTitle?: string
  metaDescription?: string
}

export type Dealer = {
  _id: string
  name: string
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
  hours?: string
  services?: string[]
  languages?: string[]
  logo?: Image
}

export type TeamMember = {
  _id: string
  name: string
  role: string
  department?: string
  photo?: Image
  bio?: string
  linkedin?: string
}

export type Milestone = {
  _id: string
  year: number
  title: string
  description: string
  category?: string
  isHighlight?: boolean
  image?: Image
}

export type DownloadAsset = {
  _id: string
  title: string
  type: 'brochure' | 'specsheet' | 'presskit' | 'manual' | 'pricelist' | 'parts-catalogue' | 'brand-asset'
  language?: string
  fileSize?: string
  publishedDate?: string
  fileUrl?: string
  thumbnail?: Image
  model?: { name: string; slug: string }
}

export type TradeFaq = {
  _id: string
  question: string
  answer: PortableTextBlock[]
  category?: string
}

export type SocialLinks = Partial<
  Record<'facebook' | 'instagram' | 'youtube' | 'twitter' | 'tiktok' | 'linkedin', string>
>

export type SiteSettings = {
  siteName?: string
  tagline?: string
  logo?: Image
  address?: string
  phone?: string
  email?: string
  googleMapsUrl?: string
  socialLinks?: SocialLinks
  statsBar?: Array<{ value: string; label: string }>
  announcementBanner?: string
  footerText?: string
  metaTitle?: string
  metaDescription?: string
  ogImage?: Image
  googleVerification?: string
  heroSlides?: Array<{ bg?: Image; fg?: Image }>
  partsSectionBg?: Image
  whySectionBg?: Image
  b2bSectionBg?: Image
  dealerSectionBg?: Image
  partsTiles?: Partial<Record<'motor' | 'battery' | 'brakes' | 'accessories', Image>>
  pageBackgrounds?: Partial<Record<'models' | 'parts' | 'news' | 'about' | 'contact' | 'dealers', Image>>
}

export type SearchResults = {
  models: ModelCard[]
  parts: PartCard[]
  posts: PostCard[]
}
