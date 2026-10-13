// Website Content
import bikeModel from './bikeModel'
import bikePart from './bikePart'
import blogPost from './blogPost'
import author from './author'
import teamMember from './teamMember'
import dealer from './dealer'
import downloadAsset from './downloadAsset'
import milestone from './milestone'
import tradePageFAQ from './tradePageFAQ'
import siteSettings from './siteSettings'

// Enquiry Documents
import b2cEnquiry from './b2cEnquiry'
import b2bEnquiry from './b2bEnquiry'
import b2cPartsEnquiry from './b2cPartsEnquiry'
import b2bPartsEnquiry from './b2bPartsEnquiry'

// Option B — Internal Business Management
import stockItem from './stockItem'
import order from './order'
import customerRecord from './customerRecord'
import staffMember from './staffMember'

export const schemaTypes = [
  // Website Content
  bikeModel,
  bikePart,
  blogPost,
  author,
  teamMember,
  dealer,
  downloadAsset,
  milestone,
  tradePageFAQ,
  siteSettings,

  // Enquiry Documents
  b2cEnquiry,
  b2bEnquiry,
  b2cPartsEnquiry,
  b2bPartsEnquiry,

  // Option B — Internal Business Management
  stockItem,
  order,
  customerRecord,
  staffMember,
]