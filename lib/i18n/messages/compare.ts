import { defineMessages } from '../define'

export const compareMessages = defineMessages({
  en: {
    eyebrow: 'Side by side',
    title: 'Compare models',
    subtitle: 'Choose up to three e-bikes and compare their specifications.',
    selectors: 'Models to compare',
    slot: (n: number) => `Model ${n}`,
    none: 'No model',
    needTwo: {
      title: 'Select at least two models',
      description: 'Use the selectors above to choose the e-bikes you want to compare.',
    },
    notEnough: {
      title: 'Comparison not available yet',
      description: 'The comparison needs at least two models in the catalogue. Browse the range or ask our team.',
      action: 'Browse models',
    },
    table: {
      caption: 'Specification comparison',
      spec: 'Specification',
      price: 'Price',
      availability: 'Availability',
      features: 'Features',
      included: 'Included',
      notIncluded: 'Not included',
      notAvailable: 'Not specified',
    },
    scrollHint: 'Swipe sideways to see every model.',
    details: 'Full details',
  },
  it: {
    eyebrow: 'Fianco a fianco',
    title: 'Confronta i modelli',
    subtitle: 'Scegli fino a tre e-bike e confronta le loro specifiche.',
    selectors: 'Modelli da confrontare',
    slot: (n: number) => `Modello ${n}`,
    none: 'Nessun modello',
    needTwo: {
      title: 'Seleziona almeno due modelli',
      description: 'Usa i selettori qui sopra per scegliere le e-bike da confrontare.',
    },
    notEnough: {
      title: 'Confronto non ancora disponibile',
      description: 'Per il confronto servono almeno due modelli in catalogo. Sfoglia la gamma o chiedi al nostro team.',
      action: 'Vedi i modelli',
    },
    table: {
      caption: 'Confronto delle specifiche',
      spec: 'Specifica',
      price: 'Prezzo',
      availability: 'Disponibilità',
      features: 'Dotazioni',
      included: 'Presente',
      notIncluded: 'Assente',
      notAvailable: 'Non indicato',
    },
    scrollHint: 'Scorri di lato per vedere tutti i modelli.',
    details: 'Tutti i dettagli',
  },
})
