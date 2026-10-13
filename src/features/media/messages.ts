import { defineMessages } from '@/lib/i18n/define'
import type { DownloadAsset } from '@/lib/sanity/types'

type DownloadTypeLabels = Record<DownloadAsset['type'], string>

export const mediaMessages = defineMessages({
  en: {
    hero: {
      eyebrow: 'Press & media',
      title: 'Media centre',
      subtitle: 'Press releases, brochures, manuals and brand materials for the Ape Ryder, RKS and Skyjet ranges.',
    },
    press: {
      eyebrow: 'Press',
      title: 'Press releases',
      emptyTitle: 'No press releases yet',
      emptyText: 'For interviews, images or information for an article, write to us and we will get back to you.',
    },
    downloads: {
      eyebrow: 'Downloads',
      title: 'Documents & materials',
      emptyTitle: 'No downloads available yet',
      emptyText: 'Brochures, manuals and spec sheets will be published here. Need a document now? Ask us.',
      download: 'Download',
      downloadLabel: (title: string) => `Download ${title}`,
      count: (n: number) => (n === 1 ? '1 file' : `${n} files`),
      types: {
        brochure: 'Brochures',
        specsheet: 'Spec sheets',
        presskit: 'Press kits',
        manual: 'User manuals',
        pricelist: 'Price lists',
        'parts-catalogue': 'Parts catalogues',
        'brand-asset': 'Brand assets',
      } satisfies DownloadTypeLabels,
    },
    contact: {
      eyebrow: 'Media enquiries',
      title: 'Talk to us',
      text: 'For interviews, images or materials not listed here, send us a request through the contact form.',
      action: 'Contact us',
    },
  },
  it: {
    hero: {
      eyebrow: 'Stampa e media',
      title: 'Area media',
      subtitle: 'Comunicati stampa, brochure, manuali e materiali del marchio per le gamme Ape Ryder, RKS e Skyjet.',
    },
    press: {
      eyebrow: 'Stampa',
      title: 'Comunicati stampa',
      emptyTitle: 'Nessun comunicato per ora',
      emptyText: 'Per interviste, immagini o informazioni per un articolo, scrivici e ti risponderemo.',
    },
    downloads: {
      eyebrow: 'Download',
      title: 'Documenti e materiali',
      emptyTitle: 'Nessun download disponibile per ora',
      emptyText: 'Qui verranno pubblicati brochure, manuali e schede tecniche. Ti serve subito un documento? Chiedicelo.',
      download: 'Scarica',
      downloadLabel: (title: string) => `Scarica ${title}`,
      count: (n: number) => (n === 1 ? '1 file' : `${n} file`),
      types: {
        brochure: 'Brochure',
        specsheet: 'Schede tecniche',
        presskit: 'Cartelle stampa',
        manual: "Manuali d'uso",
        pricelist: 'Listini prezzi',
        'parts-catalogue': 'Cataloghi ricambi',
        'brand-asset': 'Materiali del marchio',
      } satisfies DownloadTypeLabels,
    },
    contact: {
      eyebrow: 'Richieste stampa',
      title: 'Parla con noi',
      text: 'Per interviste, immagini o materiali non presenti qui, inviaci una richiesta dal modulo di contatto.',
      action: 'Contattaci',
    },
  },
})
