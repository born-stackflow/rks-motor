import { defineConfig, definePlugin } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import type { StructureBuilder } from 'sanity/structure'
import {
  BellIcon,
  UserIcon,
  UsersIcon,
  WrenchIcon,
  TagIcon,
  TagsIcon,
  DocumentIcon,
  DocumentTextIcon,
  ComposeIcon,
  PinIcon,
  TimelineIcon,
  DocumentPdfIcon,
  TaskIcon,
  ControlsIcon,
  StackCompactIcon,
  BillIcon,
  CogIcon,
  DashboardIcon,
  ArchiveIcon,
  TrendUpwardIcon,
  LockIcon,
} from '@sanity/icons'
import { schemaTypes } from './sanity/schemas'
import { Dashboard } from './sanity/components/Dashboard'
import { cmsT, getCmsLocale } from './sanity/i18n/cms-translations'

const dashboardPlugin = definePlugin({
  name: 'rks-dashboard',
  tools: (prev, context) => {
    // Translate the "Overview" tool tab label per stored locale
    const t = cmsT[getCmsLocale()]
    return [
      {
        name: 'overview',
        title: t.overview,
        icon: DashboardIcon,
        component: Dashboard,
      },
      ...prev.filter((tool) => tool.name !== 'overview'),
    ]
  },
})

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// ── Role helper ───────────────────────────────────────────────────────────────
function isAdmin(currentUser: any): boolean {
  return currentUser?.roles?.some(
    (r: { name: string }) => r.name === 'administrator'
  ) ?? false
}

const structure = (S: StructureBuilder, context: { currentUser: any }) => {
  const admin = isAdmin(context.currentUser)

  // Read locale on every structure call — changes take effect after page reload
  const t = cmsT[getCmsLocale()]

  // ── Items visible to all roles ───────────────────────────────────────────
  const sharedItems = [

    // ENQUIRIES
    S.listItem()
      .title(t.enquiries)
      .icon(BellIcon)
      .child(
        S.list()
          .title(t.enquiryManagement)
          .items([
            S.listItem()
              .title(t.b2cBikeEnquiries)
              .icon(UserIcon)
              .schemaType('b2cEnquiry')
              .child(
                S.documentTypeList('b2cEnquiry')
                  .title(t.customerBikeEnquiries)
                  .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title(t.b2cPartsEnquiries)
              .icon(WrenchIcon)
              .schemaType('b2cPartsEnquiry')
              .child(
                S.documentTypeList('b2cPartsEnquiry')
                  .title(t.customerPartsEnquiries)
                  .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
              ),
            S.divider(),
            S.listItem()
              .title(t.b2bTradeApplications)
              .icon(UsersIcon)
              .schemaType('b2bEnquiry')
              .child(
                S.documentTypeList('b2bEnquiry')
                  .title(t.tradePartnerApps)
                  .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title(t.b2bBulkParts)
              .icon(TagIcon)
              .schemaType('b2bPartsEnquiry')
              .child(
                S.documentTypeList('b2bPartsEnquiry')
                  .title(t.bulkPartsOrders)
                  .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
              ),
          ])
      ),

    S.divider(),

    // CATALOGUE
    S.listItem()
      .title(t.eBikeModels)
      .icon(DocumentIcon)
      .schemaType('bikeModel')
      .child(
        S.documentTypeList('bikeModel')
          .title(t.eBikeModels)
          .defaultOrdering([{ field: 'name', direction: 'asc' }])
      ),

    S.listItem()
      .title(t.partsAccessories)
      .icon(TagsIcon)
      .schemaType('bikePart')
      .child(
        S.documentTypeList('bikePart')
          .title(t.partsAccessories)
          .defaultOrdering([{ field: 'name', direction: 'asc' }])
      ),

    S.divider(),

    // EDITORIAL
    S.listItem()
      .title(t.newsBlog)
      .icon(ComposeIcon)
      .child(
        S.list()
          .title(t.editorial)
          .items([
            S.listItem()
              .title(t.blogPosts)
              .icon(DocumentTextIcon)
              .schemaType('blogPost')
              .child(
                S.documentTypeList('blogPost')
                  .title(t.blogPosts)
                  .defaultOrdering([{ field: 'publishedDate', direction: 'desc' }])
              ),
            S.listItem()
              .title(t.authors)
              .icon(UserIcon)
              .schemaType('author')
              .child(S.documentTypeList('author').title(t.authors)),
          ])
      ),

    S.divider(),

    // COMPANY
    S.listItem()
      .title(t.company)
      .icon(UsersIcon)
      .child(
        S.list()
          .title(t.companyContent)
          .items([
            S.listItem()
              .title(t.teamMembers)
              .icon(UsersIcon)
              .schemaType('teamMember')
              .child(S.documentTypeList('teamMember').title(t.teamMembers)),
            S.listItem()
              .title(t.companyMilestones)
              .icon(TimelineIcon)
              .schemaType('milestone')
              .child(S.documentTypeList('milestone').title(t.milestones)),
            S.listItem()
              .title(t.dealersServiceCentres)
              .icon(PinIcon)
              .schemaType('dealer')
              .child(
                S.documentTypeList('dealer')
                  .title(t.dealersServiceCentres)
                  .defaultOrdering([{ field: 'name', direction: 'asc' }])
              ),
          ])
      ),

    S.listItem()
      .title(t.mediaDownloads)
      .icon(DocumentPdfIcon)
      .schemaType('downloadAsset')
      .child(S.documentTypeList('downloadAsset').title(t.mediaDownloads)),

    S.listItem()
      .title(t.tradePageFAQs)
      .icon(TaskIcon)
      .schemaType('tradePageFAQ')
      .child(S.documentTypeList('tradePageFAQ').title(t.tradeFAQs)),
  ]

  // ── Items visible to Administrators only ────────────────────────────────
  const adminItems = [
    S.divider(),

    // BUSINESS MANAGEMENT
    S.listItem()
      .title(t.businessManagement)
      .icon(ControlsIcon)
      .child(
        S.list()
          .title(t.businessManagement)
          .items([
            S.listItem()
              .title(t.stockInventory)
              .icon(StackCompactIcon)
              .schemaType('stockItem')
              .child(
                S.documentTypeList('stockItem')
                  .title(t.stockInventory)
                  .defaultOrdering([{ field: 'quantity', direction: 'asc' }])
              ),
            S.listItem()
              .title(t.orders)
              .icon(BillIcon)
              .schemaType('order')
              .child(
                S.documentTypeList('order')
                  .title(t.allOrders)
                  .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
              ),
            S.listItem()
              .title(t.customerPartnerRecords)
              .icon(ArchiveIcon)
              .schemaType('customerRecord')
              .child(
                S.documentTypeList('customerRecord')
                  .title(t.customerPartnerRecords)
                  .defaultOrdering([{ field: 'fullName', direction: 'asc' }])
              ),
            S.listItem()
              .title(t.salesPerformance)
              .icon(TrendUpwardIcon)
              .child(
                S.documentTypeList('order')
                  .title(t.salesPerformance)
                  .defaultOrdering([{ field: 'orderDate', direction: 'desc' }])
              ),
          ])
      ),

    S.divider(),

    // STAFF & ACCESS
    S.listItem()
      .title(t.staffAccess)
      .icon(LockIcon)
      .child(
        S.list()
          .title(t.staffAccessControl)
          .items([
            S.listItem()
              .title(t.staffMembersRoles)
              .icon(UsersIcon)
              .schemaType('staffMember')
              .child(
                S.documentTypeList('staffMember')
                  .title(t.staffMembersRoles)
                  .defaultOrdering([{ field: 'name', direction: 'asc' }])
              ),
          ])
      ),

    S.divider(),

    // SETTINGS
    S.listItem()
      .title(t.siteSettings)
      .icon(CogIcon)
      .child(
        S.editor()
          .id('siteSettings')
          .schemaType('siteSettings')
          .documentId('siteSettings')
      ),
  ]

  return S.list()
    .title(t.rootTitle)
    .items([
      ...sharedItems,
      ...(admin ? adminItems : []),
    ])
}

export default defineConfig({
  name: 'rks-website',
  title: 'RKS E-Bikes CMS',

  projectId,
  dataset,

  plugins: [
    dashboardPlugin(),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: { types: schemaTypes },

  document: {
    actions: (prev, context) =>
      context.schemaType === 'siteSettings'
        ? prev.filter((action) => action.action !== 'delete')
        : prev,
  },
})
