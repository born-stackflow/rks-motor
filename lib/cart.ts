'use client'

import { useSyncExternalStore } from 'react'

/** The "cart" is an enquiry list: items are collected here and sent to the team through the contact form. */
export type CartItem = {
  id: string
  kind: 'model' | 'part'
  name: string
  slug: string
  price?: number
  image?: string
  qty: number
}

const STORAGE_KEY = 'rks-cart'
const EMPTY: CartItem[] = []
const listeners = new Set<() => void>()
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY }

function normalize(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return EMPTY
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const i = item as Record<string, unknown>
    const id = typeof i.id === 'string' ? i.id : typeof i._id === 'string' ? i._id : null
    if (!id || typeof i.name !== 'string' || typeof i.slug !== 'string') return []
    return [
      {
        id,
        kind: i.kind === 'part' ? 'part' : 'model',
        name: i.name,
        slug: i.slug,
        price: typeof i.price === 'number' ? i.price : undefined,
        image: typeof i.image === 'string' ? i.image : undefined,
        qty: typeof i.qty === 'number' && i.qty > 0 ? Math.floor(i.qty) : 1,
      } satisfies CartItem,
    ]
  })
}

function read(): CartItem[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {}
  if (raw === cache.raw) return cache.items
  let items = EMPTY
  try {
    items = raw ? normalize(JSON.parse(raw)) : EMPTY
  } catch {}
  cache = { raw, items }
  return items
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => event.key === STORAGE_KEY && listener()
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export const cart = {
  add(item: Omit<CartItem, 'qty'>, qty = 1) {
    const items = read()
    const existing = items.find((i) => i.id === item.id)
    write(existing ? items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)) : [...items, { ...item, qty }])
  },
  setQty(id: string, qty: number) {
    write(qty > 0 ? read().map((i) => (i.id === id ? { ...i, qty: Math.floor(qty) } : i)) : read().filter((i) => i.id !== id))
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id))
  },
  clear() {
    write(EMPTY)
  },
}
