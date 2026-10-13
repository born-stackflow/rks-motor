export const ENQUIRY_TYPES = ['general', 'test-ride', 'purchase', 'after-sales', 'other'] as const
export type EnquiryType = (typeof ENQUIRY_TYPES)[number]

export const MESSAGE_MIN_LENGTH = 10

export type ContactPrefill = {
  enquiryType: EnquiryType
  modelName: string
  part: string
  dealer: string
  /** Lines coming from the enquiry list ("cart"); when present the list is emptied after a successful send. */
  items: string[]
}

type RawParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? ''
}

function isEnquiryType(value: string): value is EnquiryType {
  return (ENQUIRY_TYPES as readonly string[]).includes(value)
}

/**
 * Reads the query string links use to open the form: `?type=` (ignored unless it is a valid enquiry type),
 * `?model=` (slug or name), `?part=`, `?dealer=` and `?items=` (one item per line or separated by ";").
 */
export function parseContactParams(params: RawParams, models: Array<{ name: string; slug: string }>): ContactPrefill {
  const type = first(params.type)
  const model = first(params.model).toLowerCase()
  const match = model ? models.find((m) => m.slug.toLowerCase() === model || m.name.toLowerCase() === model) : undefined

  return {
    enquiryType: isEnquiryType(type) ? type : 'general',
    modelName: match?.name ?? '',
    part: first(params.part).slice(0, 200),
    dealer: first(params.dealer).slice(0, 120),
    items: first(params.items)
      .split(/\r?\n|;/)
      .map((line) => line.trim().slice(0, 200))
      .filter(Boolean)
      .slice(0, 50),
  }
}
