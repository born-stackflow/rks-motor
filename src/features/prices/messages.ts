import { defineMessages } from '@/lib/i18n/define'

export const pricesMessages = defineMessages({
  en: {
    hero: {
      eyebrow: 'Price list',
      title: 'E-bike prices',
      subtitle: 'The current Ape Ryder, RKS and Skyjet range, grouped by brand.',
    },
    count: (n: number) => (n === 1 ? '1 model' : `${n} models`),
    table: {
      caption: (brand: string) => `${brand} price list`,
      model: 'Model',
      motor: 'Motor',
      range: 'Range',
      availability: 'Availability',
      price: 'Price',
    },
    note: 'Prices are indicative. Contact a dealer or our team for a personalised offer.',
    quote: 'Request a quote',
    dealers: 'Find a dealer',
    empty: {
      title: 'Price list coming soon',
      description: 'The catalogue is being updated. Contact us for current prices.',
      action: 'Contact us',
    },
    trade: {
      tag: 'For business',
      title: 'Partner programme',
      text: 'Retailers and businesses can apply to the RKS partner programme to discuss trade conditions with our team.',
      action: 'Apply as a partner',
    },
  },
  it: {
    hero: {
      eyebrow: 'Listino',
      title: 'Prezzi e-bike',
      subtitle: 'La gamma attuale Ape Ryder, RKS e Skyjet, divisa per marchio.',
    },
    count: (n: number) => (n === 1 ? '1 modello' : `${n} modelli`),
    table: {
      caption: (brand: string) => `Listino ${brand}`,
      model: 'Modello',
      motor: 'Motore',
      range: 'Autonomia',
      availability: 'Disponibilità',
      price: 'Prezzo',
    },
    note: "Prezzi indicativi: contatta un rivenditore o il nostro team per un'offerta personalizzata.",
    quote: 'Richiedi un preventivo',
    dealers: 'Trova un rivenditore',
    empty: {
      title: 'Listino in arrivo',
      description: 'Il catalogo è in aggiornamento. Contattaci per conoscere i prezzi attuali.',
      action: 'Contattaci',
    },
    trade: {
      tag: 'Per le aziende',
      title: 'Programma partner',
      text: 'Rivenditori e aziende possono candidarsi al programma partner RKS per valutare con il nostro team le condizioni commerciali.',
      action: 'Candidati come partner',
    },
  },
})
