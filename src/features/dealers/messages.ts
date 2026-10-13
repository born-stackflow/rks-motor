import { defineMessages } from '@/lib/i18n/define'
import type { Dealer } from '@/lib/sanity/types'

export const DEALER_SERVICES = ['sales', 'servicing', 'parts', 'test-rides', 'finance', 'warranty'] as const
export type DealerService = (typeof DEALER_SERVICES)[number]

type ServiceLabels = Record<DealerService, string>
type TypeLabels = Record<Dealer['type'], string>

export const dealersMessages = defineMessages({
  en: {
    hero: {
      eyebrow: 'Dealer network',
      title: 'Dealers',
      subtitle: 'RKS partners for sales, servicing and genuine parts.',
    },
    filters: {
      title: 'Filter dealers',
      country: 'Country',
      service: 'Service',
      search: 'City or name',
      searchPlaceholder: 'Search by city or name',
      all: 'All',
      reset: 'Reset filters',
      results: (n: number) => (n === 1 ? '1 dealer' : `${n} dealers`),
    },
    types: {
      dealer: 'Dealer',
      service: 'Service centre',
      both: 'Dealer & service centre',
    } satisfies TypeLabels,
    services: {
      sales: 'Sales',
      servicing: 'Servicing & maintenance',
      parts: 'Parts & accessories',
      'test-rides': 'Test rides',
      finance: 'Finance',
      warranty: 'Warranty repairs',
    } satisfies ServiceLabels,
    card: {
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      hours: 'Opening hours',
      services: 'Services',
      languages: 'Languages spoken',
      directions: 'Directions',
      newTab: '(opens in a new tab)',
    },
    empty: {
      title: 'Our dealer network is being built',
      text: 'We are selecting our first partners. In the meantime, contact us directly for information on models and parts.',
      action: 'Contact us',
    },
    noMatch: {
      title: 'No dealers match your search',
      text: 'Try another city, or reset the filters to see the whole network.',
    },
    trade: {
      eyebrow: 'Partner programme',
      title: 'Become a dealer',
      text: 'Do you run a shop or a workshop? Find out how to offer Ape Ryder, RKS and Skyjet e-bikes and genuine parts to your customers.',
      action: 'Discover the programme',
    },
  },
  it: {
    hero: {
      eyebrow: 'Rete rivenditori',
      title: 'Rivenditori',
      subtitle: 'I partner RKS per vendita, assistenza e ricambi originali.',
    },
    filters: {
      title: 'Filtra i rivenditori',
      country: 'Paese',
      service: 'Servizio',
      search: 'Città o nome',
      searchPlaceholder: 'Cerca per città o nome',
      all: 'Tutti',
      reset: 'Azzera i filtri',
      results: (n: number) => (n === 1 ? '1 rivenditore' : `${n} rivenditori`),
    },
    types: {
      dealer: 'Rivenditore',
      service: 'Centro assistenza',
      both: 'Rivenditore e centro assistenza',
    } satisfies TypeLabels,
    services: {
      sales: 'Vendita',
      servicing: 'Assistenza e manutenzione',
      parts: 'Ricambi e accessori',
      'test-rides': 'Prove su strada',
      finance: 'Finanziamenti',
      warranty: 'Interventi in garanzia',
    } satisfies ServiceLabels,
    card: {
      address: 'Indirizzo',
      phone: 'Telefono',
      email: 'Email',
      website: 'Sito web',
      hours: 'Orari di apertura',
      services: 'Servizi',
      languages: 'Lingue parlate',
      directions: 'Indicazioni',
      newTab: '(si apre in una nuova scheda)',
    },
    empty: {
      title: 'La rete di rivenditori è in costruzione',
      text: 'Stiamo selezionando i primi partner. Nel frattempo, contattaci direttamente per informazioni su modelli e ricambi.',
      action: 'Contattaci',
    },
    noMatch: {
      title: 'Nessun rivenditore corrisponde alla ricerca',
      text: "Prova un'altra città oppure azzera i filtri per vedere tutta la rete.",
    },
    trade: {
      eyebrow: 'Programma partner',
      title: 'Diventa rivenditore',
      text: 'Hai un negozio o un’officina? Scopri come proporre ai tuoi clienti le e-bike Ape Ryder, RKS e Skyjet e i ricambi originali.',
      action: 'Scopri il programma',
    },
  },
})
