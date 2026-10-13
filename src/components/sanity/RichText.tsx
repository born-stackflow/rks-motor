import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { SanityImage } from './SanityImage'
import type { Image } from '@/lib/sanity/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-light leading-relaxed mb-5">{children}</p>,
    h2: ({ children }) => <h2 className="font-display text-4xl text-off-white mt-10 mb-4 leading-none">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display text-3xl text-off-white mt-8 mb-3 leading-none">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold text-off-white mt-6 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red pl-5 my-6 text-off-white text-lg italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-light marker:text-red">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-light marker:text-red">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-off-white font-semibold">{children}</strong>,
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="text-red underline underline-offset-4 hover:text-red-light"
          {...(external || value?.blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }: { value: Image }) => (
      <figure className="my-8">
        <div className="relative aspect-[16/9] bg-dark-2 overflow-hidden">
          <SanityImage image={value} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
        {value.caption ? <figcaption className="text-mid text-sm mt-2">{value.caption}</figcaption> : null}
      </figure>
    ),
  },
}

export function RichText({ value }: { value: PortableTextBlock[] | undefined | null }) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}
