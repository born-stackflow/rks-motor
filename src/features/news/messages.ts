import { defineMessages } from '@/lib/i18n/define'

export const newsMessages = defineMessages({
  en: {
    hero: {
      eyebrow: 'Latest updates',
      title: 'News',
      subtitle: 'Launches, events and stories from the Ape Ryder, RKS and Skyjet world.',
    },
    filter: {
      label: 'Filter by category',
      all: 'All',
    },
    featured: 'Featured',
    readArticle: 'Read article',
    by: (name: string) => `By ${name}`,
    empty: {
      title: 'No news yet',
      text: 'The first articles are on their way. In the meantime, discover the range.',
      action: 'Discover the models',
    },
    article: {
      back: 'Back to news',
      published: 'Published',
      readingTime: (minutes: number) => `${minutes} min read`,
      tags: 'Tags',
      relatedModels: 'Models in this article',
      share: 'Share',
      copyLink: 'Copy link',
      copied: 'Link copied',
      copyFailed: 'Copy failed: select the address in the browser bar',
      shareVia: (network: string) => `Share via ${network}`,
      email: 'Email',
    },
  },
  it: {
    hero: {
      eyebrow: 'Ultimi aggiornamenti',
      title: 'Notizie',
      subtitle: 'Lanci, eventi e storie dal mondo Ape Ryder, RKS e Skyjet.',
    },
    filter: {
      label: 'Filtra per categoria',
      all: 'Tutte',
    },
    featured: 'In evidenza',
    readArticle: "Leggi l'articolo",
    by: (name: string) => `Di ${name}`,
    empty: {
      title: 'Nessuna notizia per ora',
      text: 'I primi articoli sono in arrivo. Nel frattempo, scopri la gamma.',
      action: 'Scopri i modelli',
    },
    article: {
      back: 'Torna alle notizie',
      published: 'Pubblicato il',
      readingTime: (minutes: number) => `${minutes} min di lettura`,
      tags: 'Tag',
      relatedModels: "Modelli citati nell'articolo",
      share: 'Condividi',
      copyLink: 'Copia link',
      copied: 'Link copiato',
      copyFailed: "Copia non riuscita: seleziona l'indirizzo nella barra del browser",
      shareVia: (network: string) => `Condividi via ${network}`,
      email: 'Email',
    },
  },
})
