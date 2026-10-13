'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search } from '@/components/ui/Icon'
import { useMessages } from '@/contexts/LanguageContext'
import { searchMessages } from '@/lib/i18n/messages/search'

export function SearchForm({ initialQuery }: { initialQuery: string }) {
  const m = useMessages(searchMessages)
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)
  const [pending, startTransition] = useTransition()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = value.trim()
    startTransition(() => router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search'))
  }

  return (
    <form role="search" action="/search" method="get" onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor="site-search" className="sr-only">
          {m.label}
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-light" />
        <input
          id="site-search"
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={m.placeholder}
          enterKeyHint="search"
          maxLength={100}
          className="input h-14 pl-12 text-base"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary h-14 justify-center disabled:cursor-wait disabled:opacity-70">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        {m.submit}
      </button>
    </form>
  )
}
