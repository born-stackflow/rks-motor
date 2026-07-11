import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCounter } from '@/components/ui/StatCounter'
import { ArrowRight, Award, Zap, Globe, Wrench } from '@/components/ui/Icon'

export const metadata: Metadata = {
  title: 'About RKS | Premium Italian E-Bikes Since 1985',
  description: 'Discover the story behind RKS — from our humble beginnings in Milan to becoming a leading premium e-bike manufacturer.',
}

const values = [
  { icon: <Award className="h-8 w-8" />,  title: 'Italian Craftsmanship',   desc: 'Every RKS e-bike is meticulously crafted in our Milan facility, combining traditional artisanship with cutting-edge technology.' },
  { icon: <Zap className="h-8 w-8" />,    title: 'Race-Proven Performance',  desc: 'Born from decades of motorsport. Every road e-bike inherits technical advances pioneered on the track.' },
  { icon: <Wrench className="h-8 w-8" />, title: 'Engineering Excellence',   desc: 'Our R&D team continuously pioneers technologies that set new standards in electric powertrain, chassis, and rider interface design.' },
  { icon: <Globe className="h-8 w-8" />,  title: 'Global Rider Community',   desc: 'RKS riders are part of an exclusive family — supported through international events, track days, and owner programmes.' },
]

const milestones = [
  { year: '1985', event: 'RKS founded in Milan by Rosario Kaleo, building lightweight competition bikes for Italian club racing.' },
  { year: '1991', event: 'Launch of the landmark RKS R-500 — our first road-legal production e-bike. 1,200 units sold in year one.' },
  { year: '1998', event: 'First E-Racing Championship entry. RKS Racing finishes 4th in the Constructor Championship on debut.' },
  { year: '2004', event: 'European expansion — dealer network reaches 20 countries. Factory relocated to new 40,000m² Milan facility.' },
  { year: '2012', event: 'Adventure Series launches with the A-800. Voted E-Bike of the Year by three European publications.' },
  { year: '2019', event: 'RKS full-electric platform unveiled at EICMA. Zero-emission roadmap announced for 2025.' },
  { year: '2024', event: 'E-Racing Constructor Championship title. RKS E1000 breaks the 0–100km/h electric production record.' },
]

const team = [
  { name: 'Marco Kaleo',      role: 'CEO & Founder\'s Son',    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=85' },
  { name: 'Elena Rossetti',   role: 'Chief Design Officer',    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=85' },
  { name: 'Stefan Braun',     role: 'Head of Engineering',     image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=85' },
  { name: 'Lucia Fontana',    role: 'VP Global Sales & Trade', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=85' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[420px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=90"
          alt="About RKS"
          fill priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90" />
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container">
            <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-4">Our Story</p>
            <h1
              className="text-off-white leading-none mb-4"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3.5rem, 8vw, 7rem)', letterSpacing: '0.02em' }}
            >
              Born in Milan
            </h1>
            <div className="h-[3px] w-[60px] bg-red" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-red py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '1985',  label: 'Founded in Milan' },
              { value: '40+',   label: 'Years of Excellence' },
              { value: '50+',   label: 'Global Dealers' },
              { value: '15k+',  label: 'Riders Worldwide' },
            ].map((s, i) => (
              <StatCounter key={i} value={s.value} label={s.label} color="white" />
            ))}
          </div>
        </div>
      </section>

      {/* Story split */}
      <section className="section bg-dark">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <div>
              <SectionHeading tag="Our Heritage" title="Forty Years of Obsession" subtitle="What began as a small workshop producing club-racing machines has grown into one of Europe's most respected e-bike marques." />
              <p className="text-light text-sm leading-relaxed mt-6 mb-6">
                Rosario Kaleo founded RKS in 1985 with a single belief: that an e-bike should stir emotion in equal measure to its performance. Every engineering decision — from motor geometry to battery placement — is evaluated against that founding principle.
              </p>
              <p className="text-light text-sm leading-relaxed mb-8">
                Today, we manufacture nine model families across sport, adventure, cruiser, urban, and electric categories — all engineered and assembled in our Milan facility by craftspeople who ride the same e-bikes they build.
              </p>
              <Link href="/models" className="btn-primary">
                Explore Our Range <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=85"
                alt="RKS factory"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed factory image */}
      <div className="relative h-[50vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1601758174493-bc7a2b5a4a87?w=1920&q=85"
          alt="Factory"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-3">Milan, Italy</p>
            <h2
              className="text-off-white leading-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              Where Every Bike is Born
            </h2>
          </div>
        </div>
      </div>

      {/* Values */}
      <section className="section bg-black">
        <div className="container">
          <SectionHeading tag="What We Stand For" title="Our Values" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((v, i) => (
              <div
                key={i}
                className="card p-7 group hover:border-red"
              >
                <div className="text-red mb-4 group-hover:scale-110 transition-transform duration-300">{v.icon}</div>
                <h3 className="text-off-white font-bold text-base mb-2 group-hover:text-red transition-colors">{v.title}</h3>
                <p className="text-light text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="section bg-dark">
        <div className="container max-w-4xl">
          <SectionHeading tag="Key Moments" title="Our Journey" subtitle="Four decades of racing, innovation, and milestones that shaped the RKS of today." align="center" />
          <div className="mt-14 space-y-0">
            {milestones.map((m, i) => (
              <div key={i} className={`flex gap-6 md:gap-10 py-6 border-b border-dark-3 last:border-0 ${i % 2 === 0 ? 'bg-dark' : 'bg-black'} px-4`}>
                <div className="shrink-0 w-14 md:w-20 text-right">
                  <span className="text-red font-bold text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>{m.year}</span>
                </div>
                <div className="flex-1 flex items-start gap-4">
                  <div className="w-px bg-red self-stretch shrink-0 mt-1" />
                  <p className="text-light text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-black">
        <div className="container">
          <SectionHeading tag="The People" title="Leadership Team" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {team.map((member, i) => (
              <div key={i} className="group text-center">
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 overflow-hidden border-2 border-dark-3 group-hover:border-red transition-colors duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h4 className="text-off-white font-bold text-sm group-hover:text-red transition-colors">{member.name}</h4>
                <p className="text-mid text-xs mt-1 uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality / heritage */}
      <section className="relative h-[45vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1920&q=85"
          alt="RKS Heritage"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65 flex items-center">
          <div className="container">
            <div className="max-w-2xl">
              <p className="text-red text-xs font-semibold uppercase tracking-[0.3em] mb-4">40 Years On</p>
              <h2
                className="text-off-white leading-none mb-6"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
              >
                The Obsession Never Stops
              </h2>
              <Link href="/models" className="btn-primary">
                Discover Our E-Bikes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
