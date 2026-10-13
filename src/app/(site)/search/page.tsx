import type { Metadata } from 'next'
import { sanityFetchSafe } from '@/lib/sanity/fetch'
import { searchQuery } from '@/lib/sanity/queries'
import type { SearchResults } from '@/lib/sanity/types'
import { SearchView } from '@/features/search/SearchView'

type Props = { searchParams: Promise<{ q?: string | string[] }> }

const MIN_LENGTH = 2
const MAX_LENGTH = 100
const EMPTY: SearchResults = { models: [], parts: [], posts: [] }

function readQuery(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  return (raw ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH)
}

/**
 * Turns free text into a GROQ `match` pattern: punctuation is dropped and every word becomes a prefix,
 * so "brake pa" finds "Brake pads" and "eng-af" finds part number "ENG-AF-002".
 * The brand is stored as "aperyder", hence the rewrite of "Ape Ryder".
 */
function toMatchTerm(query: string) {
  return query
    .replace(/ape\s+ryder/gi, 'aperyder')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(0, 6)
    .map((word) => `${word}*`)
    .join(' ')
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = readQuery((await searchParams).q)
  return {
    title: query ? `Search: ${query}` : 'Search',
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const query = readQuery((await searchParams).q)

  let results: SearchResults | null = null
  if (query.length >= MIN_LENGTH) {
    const term = toMatchTerm(query)
    results = term ? await sanityFetchSafe<SearchResults>(searchQuery, { term }, EMPTY) : EMPTY
  }

  return <SearchView query={query} results={results} minLength={MIN_LENGTH} />
}
