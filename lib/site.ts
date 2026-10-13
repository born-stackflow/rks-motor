import type { Brand, ModelAvailability, PartAvailability, PartCategory, PostCategory } from './sanity/types'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://rksitalia.it').replace(/\/$/, '')
export const SITE_NAME = 'RKS'

export type Locale = 'en' | 'it'
export type Localized = Record<Locale, string>

export const BRANDS: Record<Brand, string> = {
  aperyder: 'Ape Ryder',
  rks: 'RKS',
  skyjet: 'Skyjet',
}

export const BRAND_ORDER: Brand[] = ['aperyder', 'rks', 'skyjet']

export function brandLabel(brand: string | undefined) {
  return (brand && BRANDS[brand as Brand]) || brand || ''
}

export function isBrand(value: string | null | undefined): value is Brand {
  return !!value && value in BRANDS
}

export const MODEL_AVAILABILITY: Record<ModelAvailability, { label: Localized; tone: 'green' | 'amber' | 'dark' }> = {
  'in-stock': { label: { en: 'In stock', it: 'Disponibile' }, tone: 'green' },
  'pre-order': { label: { en: 'Pre-order', it: 'Preordine' }, tone: 'amber' },
  'coming-soon': { label: { en: 'Coming soon', it: 'In arrivo' }, tone: 'amber' },
  discontinued: { label: { en: 'Discontinued', it: 'Fuori produzione' }, tone: 'dark' },
}

export const PART_AVAILABILITY: Record<PartAvailability, { label: Localized; tone: 'green' | 'amber' | 'dark' }> = {
  'in-stock': { label: { en: 'In stock', it: 'Disponibile' }, tone: 'green' },
  'order-required': { label: { en: 'Made to order', it: 'Su ordinazione' }, tone: 'amber' },
  'out-of-stock': { label: { en: 'Out of stock', it: 'Esaurito' }, tone: 'dark' },
}

export const PART_CATEGORIES: Record<PartCategory, Localized> = {
  motor: { en: 'Motors', it: 'Motori' },
  battery: { en: 'Batteries', it: 'Batterie' },
  brakes: { en: 'Brakes', it: 'Freni' },
  suspension: { en: 'Suspension', it: 'Sospensioni' },
  electrical: { en: 'Electrical', it: 'Impianto elettrico' },
  gears: { en: 'Drivetrain', it: 'Trasmissione' },
  body: { en: 'Frame & body', it: 'Telaio e carrozzeria' },
  tyres: { en: 'Wheels & tyres', it: 'Ruote e pneumatici' },
  accessories: { en: 'Accessories', it: 'Accessori' },
}

export function isPartCategory(value: string | null | undefined): value is PartCategory {
  return !!value && value in PART_CATEGORIES
}

export const PART_TYPES: Record<'oem' | 'aftermarket' | 'accessory', Localized> = {
  oem: { en: 'Genuine OEM', it: 'Originale OEM' },
  aftermarket: { en: 'Aftermarket', it: 'Aftermarket' },
  accessory: { en: 'Accessory', it: 'Accessorio' },
}

export const POST_CATEGORIES: Record<PostCategory, Localized> = {
  news: { en: 'News', it: 'Notizie' },
  launches: { en: 'Launches', it: 'Lanci' },
  events: { en: 'Events', it: 'Eventi' },
  press: { en: 'Press', it: 'Stampa' },
  technology: { en: 'Technology', it: 'Tecnologia' },
  lifestyle: { en: 'Lifestyle', it: 'Lifestyle' },
}

export const SPEC_LABELS: Record<string, Localized> = {
  motor: { en: 'Motor', it: 'Motore' },
  maxSpeed: { en: 'Max speed', it: 'Velocità massima' },
  ridingModes: { en: 'Riding modes', it: 'Modalità di guida' },
  range: { en: 'Range', it: 'Autonomia' },
  battery: { en: 'Battery', it: 'Batteria' },
  chargingTime: { en: 'Charging time', it: 'Tempo di ricarica' },
  displayPanel: { en: 'Display', it: 'Display' },
  frontLight: { en: 'Front light', it: 'Luce anteriore' },
  rearLight: { en: 'Rear light', it: 'Luce posteriore' },
  frontFork: { en: 'Front fork', it: 'Forcella' },
  rearSuspension: { en: 'Rear suspension', it: 'Sospensione posteriore' },
  brakes: { en: 'Brakes', it: 'Freni' },
  tires: { en: 'Tyres', it: 'Pneumatici' },
  gearSystem: { en: 'Gear system', it: 'Cambio' },
  chainring: { en: 'Chainring', it: 'Corona' },
  derailleur: { en: 'Derailleur', it: 'Deragliatore' },
  frame: { en: 'Frame', it: 'Telaio' },
  saddle: { en: 'Saddle', it: 'Sella' },
  pedals: { en: 'Pedals', it: 'Pedali' },
  bag: { en: 'Bag', it: 'Borsa' },
  fender: { en: 'Mudguards', it: 'Parafanghi' },
  rearCarrier: { en: 'Rear carrier', it: 'Portapacchi' },
  weight: { en: 'Weight', it: 'Peso' },
}

export const SPEC_ORDER = Object.keys(SPEC_LABELS)
