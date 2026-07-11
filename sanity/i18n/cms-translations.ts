export type CmsLocale = 'en' | 'it'

export const cmsT = {
  en: {
    // ── Root title ──────────────────────────────────────────────
    rootTitle: 'RKS E-Bikes',

    // ── Enquiries ───────────────────────────────────────────────
    enquiries:              'Enquiries',
    enquiryManagement:      'Enquiry Management',
    b2cBikeEnquiries:       'B2C — E-Bike Enquiries',
    customerBikeEnquiries:  'Customer E-Bike Enquiries',
    b2cPartsEnquiries:      'B2C — Parts Enquiries',
    customerPartsEnquiries: 'Customer Parts Enquiries',
    b2bTradeApplications:   'B2B — Trade Applications',
    tradePartnerApps:       'Trade Partner Applications',
    b2bBulkParts:           'B2B — Bulk Parts Orders',
    bulkPartsOrders:        'Bulk Parts Orders',

    // ── Catalogue ───────────────────────────────────────────────
    eBikeModels:            'E-Bike Models',
    partsAccessories:       'Parts & Accessories',

    // ── Editorial ───────────────────────────────────────────────
    newsBlog:               'News & Blog',
    editorial:              'Editorial',
    blogPosts:              'Blog Posts',
    authors:                'Authors',

    // ── Company ─────────────────────────────────────────────────
    company:                'Company',
    companyContent:         'Company Content',
    teamMembers:            'Team Members',
    companyMilestones:      'Company Milestones',
    milestones:             'Milestones',
    dealersServiceCentres:  'Dealers & Service Centres',
    mediaDownloads:         'Media & Downloads',
    tradePageFAQs:          'Trade Page FAQs',
    tradeFAQs:              'Trade FAQs',

    // ── Business Management (admin only) ────────────────────────
    businessManagement:     'Business Management',
    stockInventory:         'Stock & Inventory',
    orders:                 'Orders',
    allOrders:              'All Orders',
    customerPartnerRecords: 'Customer & Partner Records',
    salesPerformance:       'Sales Performance',

    // ── Staff & Access (admin only) ─────────────────────────────
    staffAccess:            'Staff & Access',
    staffAccessControl:     'Staff & Access Control',
    staffMembersRoles:      'Staff Members & Roles',

    // ── Settings ────────────────────────────────────────────────
    siteSettings:           'Site Settings',

    // ── Tool nav label ──────────────────────────────────────────
    overview:               'Overview',
  },

  it: {
    // ── Root title ──────────────────────────────────────────────
    rootTitle: 'RKS E-Bikes',

    // ── Enquiries ───────────────────────────────────────────────
    enquiries:              'Richieste',
    enquiryManagement:      'Gestione Richieste',
    b2cBikeEnquiries:       'B2C — Richieste E-Bike',
    customerBikeEnquiries:  'Richieste E-Bike Clienti',
    b2cPartsEnquiries:      'B2C — Richieste Ricambi',
    customerPartsEnquiries: 'Richieste Ricambi Clienti',
    b2bTradeApplications:   'B2B — Candidature Commerciali',
    tradePartnerApps:       'Candidature Partner Commerciali',
    b2bBulkParts:           'B2B — Ordini Ricambi Bulk',
    bulkPartsOrders:        'Ordini Ricambi Bulk',

    // ── Catalogue ───────────────────────────────────────────────
    eBikeModels:            'Modelli E-Bike',
    partsAccessories:       'Ricambi e Accessori',

    // ── Editorial ───────────────────────────────────────────────
    newsBlog:               'Notizie e Blog',
    editorial:              'Editoriale',
    blogPosts:              'Articoli del Blog',
    authors:                'Autori',

    // ── Company ─────────────────────────────────────────────────
    company:                'Azienda',
    companyContent:         'Contenuti Aziendali',
    teamMembers:            'Membri del Team',
    companyMilestones:      'Traguardi Aziendali',
    milestones:             'Traguardi',
    dealersServiceCentres:  'Rivenditori e Centri Assistenza',
    mediaDownloads:         'Media e Download',
    tradePageFAQs:          'FAQ Pagina Commerciale',
    tradeFAQs:              'FAQ Commerciali',

    // ── Business Management (admin only) ────────────────────────
    businessManagement:     'Gestione Aziendale',
    stockInventory:         'Scorte e Inventario',
    orders:                 'Ordini',
    allOrders:              'Tutti gli Ordini',
    customerPartnerRecords: 'Schede Clienti e Partner',
    salesPerformance:       'Performance Vendite',

    // ── Staff & Access (admin only) ─────────────────────────────
    staffAccess:            'Staff e Accesso',
    staffAccessControl:     'Staff e Controllo Accessi',
    staffMembersRoles:      'Membri Staff e Ruoli',

    // ── Settings ────────────────────────────────────────────────
    siteSettings:           'Impostazioni Sito',

    // ── Tool nav label ──────────────────────────────────────────
    overview:               'Panoramica',
  },
} as const

export function getCmsLocale(): CmsLocale {
  try {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem('rks-cms-locale')
    return saved === 'it' ? 'it' : 'en'
  } catch {
    return 'en'
  }
}
