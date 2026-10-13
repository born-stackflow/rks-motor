import { defineMessages } from '@/lib/i18n/define'

type DepartmentLabels = Record<'leadership' | 'engineering' | 'design' | 'sales' | 'operations' | 'after-sales', string>

export const aboutMessages = defineMessages({
  en: {
    hero: {
      eyebrow: 'About RKS',
      title: 'About us',
      subtitle: 'E-bikes from three brands, genuine spare parts and a programme for trade partners.',
    },
    intro: {
      eyebrow: 'At a glance',
      title: 'Three brands, one range',
      paragraphs: [
        'RKS offers electric bikes from three brands: Ape Ryder, RKS and Skyjet. Each range has its own character, and every model comes with clear specifications so you can compare them and choose the one that suits the way you ride.',
        'Alongside the bikes we supply genuine spare parts and accessories, and we work with shops and businesses through a dedicated partner programme.',
        'Questions about a model, a part or a partnership? Write to us and our team will get back to you.',
      ],
    },
    brands: {
      eyebrow: 'Our brands',
      title: 'Ape Ryder, RKS, Skyjet',
      models: (n: number) => (n === 1 ? '1 model' : `${n} models`),
      comingSoon: 'Range coming soon',
      explore: (brand: string) => `Explore ${brand}`,
    },
    offer: {
      eyebrow: 'What we do',
      title: 'Bikes, parts, partners',
      items: [
        {
          title: 'E-bikes',
          text: 'The Ape Ryder, RKS and Skyjet ranges, with full specifications and side-by-side comparison.',
          action: 'Browse models',
          href: '/models',
        },
        {
          title: 'Genuine parts',
          text: 'Original spare parts and accessories to keep every e-bike in good shape.',
          action: 'Browse parts',
          href: '/parts',
        },
        {
          title: 'Partner programme',
          text: 'For shops and businesses that want to offer our e-bikes and parts to their customers.',
          action: 'Become a partner',
          href: '/trade',
        },
      ],
    },
    milestones: {
      eyebrow: 'Our story',
      title: 'Milestones',
    },
    team: {
      eyebrow: 'Our people',
      title: 'The team',
      linkedin: (name: string) => `${name} on LinkedIn`,
      departments: {
        leadership: 'Leadership',
        engineering: 'Engineering',
        design: 'Design',
        sales: 'Sales & marketing',
        operations: 'Operations',
        'after-sales': 'After-sales',
      } satisfies DepartmentLabels,
    },
    cta: {
      title: "Let's talk",
      text: 'Looking for a model, a spare part or a partnership? Get in touch.',
      contact: 'Contact us',
      partner: 'Become a partner',
    },
  },
  it: {
    hero: {
      eyebrow: 'Chi è RKS',
      title: 'Chi siamo',
      subtitle: 'E-bike di tre marchi, ricambi originali e un programma per i partner commerciali.',
    },
    intro: {
      eyebrow: 'In breve',
      title: 'Tre marchi, una gamma',
      paragraphs: [
        'RKS propone biciclette elettriche di tre marchi: Ape Ryder, RKS e Skyjet. Ogni gamma ha un carattere proprio e ogni modello è presentato con specifiche chiare, così puoi confrontarli e scegliere quello più adatto al tuo modo di pedalare.',
        'Accanto alle bici forniamo ricambi e accessori originali e collaboriamo con negozi e aziende attraverso un programma dedicato ai partner.',
        'Hai domande su un modello, un ricambio o una collaborazione? Scrivici e il nostro team ti risponderà.',
      ],
    },
    brands: {
      eyebrow: 'I nostri marchi',
      title: 'Ape Ryder, RKS, Skyjet',
      models: (n: number) => (n === 1 ? '1 modello' : `${n} modelli`),
      comingSoon: 'Gamma in arrivo',
      explore: (brand: string) => `Scopri ${brand}`,
    },
    offer: {
      eyebrow: 'Cosa facciamo',
      title: 'Bici, ricambi, partner',
      items: [
        {
          title: 'E-bike',
          text: 'Le gamme Ape Ryder, RKS e Skyjet, con specifiche complete e confronto tra modelli.',
          action: 'Vedi i modelli',
          href: '/models',
        },
        {
          title: 'Ricambi originali',
          text: 'Ricambi e accessori originali per mantenere ogni e-bike in piena efficienza.',
          action: 'Vedi i ricambi',
          href: '/parts',
        },
        {
          title: 'Programma partner',
          text: 'Per negozi e aziende che vogliono proporre le nostre e-bike e i nostri ricambi ai propri clienti.',
          action: 'Diventa partner',
          href: '/trade',
        },
      ],
    },
    milestones: {
      eyebrow: 'La nostra storia',
      title: 'Le tappe',
    },
    team: {
      eyebrow: 'Le persone',
      title: 'Il team',
      linkedin: (name: string) => `${name} su LinkedIn`,
      departments: {
        leadership: 'Direzione',
        engineering: 'Ingegneria',
        design: 'Design',
        sales: 'Vendite e marketing',
        operations: 'Operazioni',
        'after-sales': 'Post-vendita',
      } satisfies DepartmentLabels,
    },
    cta: {
      title: 'Parliamone',
      text: 'Cerchi un modello, un ricambio o una collaborazione? Contattaci.',
      contact: 'Contattaci',
      partner: 'Diventa partner',
    },
  },
})
