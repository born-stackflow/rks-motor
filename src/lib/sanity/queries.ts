import { defineQuery } from 'next-sanity'

/** Image projection that also returns the dominant colour Sanity computes for every asset, used as placeholder. */
const withColor = `{..., "color": asset->metadata.palette.dominant.background}`

const modelCard = /* groq */ `
  _id, name, "slug": slug.current, "brand": category, tagline, price, isNew, isFeatured, availability,
  "image": coalesce(colours[0].image, heroImage)${withColor},
  "motor": specs.motor, "maxSpeed": specs.maxSpeed, "range": specs.range, "battery": specs.battery
`

const partCard = /* groq */ `
  _id, name, "slug": slug.current, partNumber, category, partType, retailPrice, availability,
  isFeatured, soldAs,
  "image": images[0]${withColor},
  "compatibleModels": compatibleModels[]->{ name, "slug": slug.current }
`

const postCard = /* groq */ `
  _id, title, "slug": slug.current, excerpt, category, isFeatured, publishedDate, tags,
  "image": featuredImage${withColor},
  author->{ name, photo, role }
`

export const settingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  siteName, tagline, logo, address, phone, email, googleMapsUrl,
  socialLinks, statsBar, announcementBanner, footerText,
  metaTitle, metaDescription, ogImage, googleVerification,
  "heroSlides": [
    { "bg": heroSlide1Bg${withColor}, "fg": heroSlide1Fg${withColor} },
    { "bg": heroSlide2Bg${withColor}, "fg": heroSlide2Fg${withColor} },
    { "bg": heroSlide3Bg${withColor}, "fg": heroSlide3Fg${withColor} },
    { "bg": heroSlide4Bg${withColor}, "fg": heroSlide4Fg${withColor} },
    { "bg": heroSlide5Bg${withColor}, "fg": heroSlide5Fg${withColor} }
  ],
  "partsSectionBg": partsSectionBg${withColor}, "whySectionBg": whySectionBg${withColor},
  "b2bSectionBg": b2bSectionBg${withColor}, "dealerSectionBg": dealerSectionBg${withColor},
  "partsTiles": {
    "motor": partsTileMotorImage${withColor},
    "battery": partsTileBatteryImage${withColor},
    "brakes": partsTileBrakesImage${withColor},
    "accessories": partsTileAccessoriesImage${withColor}
  },
  "pageBackgrounds": {
    "models": modelsPageBg${withColor},
    "parts": partsPageBg${withColor},
    "news": newsPageBg${withColor},
    "about": aboutPageBg${withColor},
    "contact": contactPageBg${withColor},
    "dealers": dealersPageBg${withColor}
  }
}`)

export const featuredModelsQuery = defineQuery(`*[_type == "bikeModel" && isFeatured == true]
  | order(order asc, name asc) [0...6] { ${modelCard} }`)

export const allModelsQuery = defineQuery(`*[_type == "bikeModel"]
  | order(order asc, name asc) { ${modelCard} }`)

export const navModelsQuery = defineQuery(`*[_type == "bikeModel"]
  | order(order asc, name asc) { _id, name, "slug": slug.current, "brand": category, "image": heroImage }`)

export const modelSlugsQuery = defineQuery(`*[_type == "bikeModel" && defined(slug.current)].slug.current`)

export const modelBySlugQuery = defineQuery(`*[_type == "bikeModel" && slug.current == $slug][0]{
  ${modelCard},
  features, b2cPriceNote, "heroImage": heroImage${withColor}, "hotspotImage": hotspotImage${withColor},
  "gallery": gallery[]${withColor}, "colours": colours[]{ ..., "image": image${withColor} }, specs, description,
  keyFeatures[]{ title, description, "image": image${withColor} },
  hotspots,
  "specSheetUrl": specSheetPDF.asset->url,
  "related": select(
    count(relatedModels) > 0 => relatedModels[]->{ ${modelCard} },
    *[_type == "bikeModel" && category == ^.category && _id != ^._id] | order(order asc, name asc) [0...4] { ${modelCard} }
  ),
  metaTitle, metaDescription
}`)

export const compareModelsQuery = defineQuery(`*[_type == "bikeModel"]
  | order(order asc, name asc) { ${modelCard}, specs, features }`)

export const featuredPartsQuery = defineQuery(`*[_type == "bikePart" && isFeatured == true]
  | order(name asc) [0...8] { ${partCard} }`)

export const allPartsQuery = defineQuery(`*[_type == "bikePart"] | order(name asc) { ${partCard} }`)

export const partSlugsQuery = defineQuery(`*[_type == "bikePart" && defined(slug.current)].slug.current`)

export const partBySlugQuery = defineQuery(`*[_type == "bikePart" && slug.current == $slug][0]{
  ${partCard},
  manufacturerPartNumber, replacesPartNumber, leadTime, quantityInPackage, packageIncludes, warranty,
  description, "images": images[]${withColor}, dimensions, technicalSpecs, material, surfaceFinish, coating,
  fitmentNotes, yearRangeFrom, yearRangeTo,
  "compatibleModels": compatibleModels[]->{ name, "slug": slug.current, "brand": category, "image": heroImage },
  "related": *[_type == "bikePart" && category == ^.category && _id != ^._id] | order(name asc) [0...4] { ${partCard} },
  metaTitle, metaDescription
}`)

export const partCategorySummaryQuery = defineQuery(`[
  { "category": "motor", "count": count(*[_type == "bikePart" && category == "motor"]),
    "image": *[_type == "bikePart" && category == "motor" && count(images) > 0] | order(name asc) [0].images[0] },
  { "category": "battery", "count": count(*[_type == "bikePart" && category == "battery"]),
    "image": *[_type == "bikePart" && category == "battery" && count(images) > 0] | order(name asc) [0].images[0] },
  { "category": "brakes", "count": count(*[_type == "bikePart" && category == "brakes"]),
    "image": *[_type == "bikePart" && category == "brakes" && count(images) > 0] | order(name asc) [0].images[0] },
  { "category": "accessories", "count": count(*[_type == "bikePart" && category == "accessories"]),
    "image": *[_type == "bikePart" && category == "accessories" && count(images) > 0] | order(name asc) [0].images[0] }
]`)

export const latestPostsQuery = defineQuery(`*[_type == "blogPost" && defined(slug.current)]
  | order(publishedDate desc) [0...6] { ${postCard} }`)

export const allPostsQuery = defineQuery(`*[_type == "blogPost" && defined(slug.current)]
  | order(publishedDate desc) { ${postCard} }`)

export const postSlugsQuery = defineQuery(`*[_type == "blogPost" && defined(slug.current)].slug.current`)

export const postBySlugQuery = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  ${postCard},
  body,
  author->{ name, photo, role, bio },
  "relatedModels": relatedModels[]->{ ${modelCard} },
  metaTitle, metaDescription
}`)

export const pressReleasesQuery = defineQuery(`*[_type == "blogPost" && category == "press" && defined(slug.current)]
  | order(publishedDate desc) [0...6] { ${postCard} }`)

export const dealersQuery = defineQuery(`*[_type == "dealer" && isActive != false]
  | order(country asc, city asc, name asc) {
  _id, name, type, address, city, region, country, phone, email, website,
  latitude, longitude, hours, services, languages, logo
}`)

export const teamQuery = defineQuery(`*[_type == "teamMember" && isVisible != false]
  | order(order asc) { _id, name, role, department, photo, bio, linkedin }`)

export const milestonesQuery = defineQuery(`*[_type == "milestone"]
  | order(year asc) { _id, year, title, description, category, isHighlight, image }`)

export const downloadsQuery = defineQuery(`*[_type == "downloadAsset" && isPublic != false && defined(file.asset)]
  | order(type asc, title asc) {
  _id, title, type, language, fileSize, publishedDate, thumbnail,
  "fileUrl": file.asset->url,
  "model": model->{ name, "slug": slug.current }
}`)

export const tradeFaqsQuery = defineQuery(`*[_type == "tradePageFAQ" && isVisible != false]
  | order(category asc, order asc) { _id, question, answer, category }`)

export const searchQuery = defineQuery(`{
  "models": *[_type == "bikeModel" && [name, tagline, category, specs.motor] match $term]
    | order(order asc, name asc) [0...12] { ${modelCard} },
  "parts": *[_type == "bikePart" && [name, partNumber, manufacturerPartNumber, category] match $term]
    | order(name asc) [0...12] { ${partCard} },
  "posts": *[_type == "blogPost" && defined(slug.current) && [title, excerpt, tags[]] match $term]
    | order(publishedDate desc) [0...12] { ${postCard} }
}`)

export const sitemapQuery = defineQuery(`{
  "models": *[_type == "bikeModel" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "parts": *[_type == "bikePart" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`)
