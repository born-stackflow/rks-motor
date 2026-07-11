/**
 * Run once to seed Sanity with e-bike blog posts and authors.
 * Usage: node sanity/seed/seedBlogPosts.mjs
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'f3zi3siz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skCokcXeHjy0bvustRJFE2PCYDbkjoIiZSRL374jmrhYIwhi6XbV3L2lyq2PUVTPu9jSj5BqiVw9rQxymHKPMRgPt5cVlz14G64XV0jTMhhVtkRBHU2jcLrfLfpnlDz9cGhp1u38YGzctTsVcysBIH8tppmm2c0oUmHZKYlAdspEQ7SuD8g2',
  useCdn: false,
})

function block(text, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style,
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
    markDefs: [],
  }
}

async function seed() {
  console.log('Seeding authors...')

  const author1 = await client.createOrReplace({
    _id: 'author-luca-romani',
    _type: 'author',
    name: 'Luca Romani',
    role: 'Head of Product & Technology',
    bio: 'Luca has spent 12 years in the electric mobility industry, leading product development at RKS. He specialises in battery systems and smart motor technology.',
  })

  const author2 = await client.createOrReplace({
    _id: 'author-sofia-esposito',
    _type: 'author',
    name: 'Sofia Esposito',
    role: 'Brand & Content Manager',
    bio: 'Sofia leads the RKS brand story with a passion for sustainable transport and Italian design culture.',
  })

  const author3 = await client.createOrReplace({
    _id: 'author-marco-ferretti',
    _type: 'author',
    name: 'Marco Ferretti',
    role: 'Technical Editor',
    bio: 'Marco covers e-bike technology in depth — from drivetrain mechanics to battery chemistry and smart connectivity.',
  })

  console.log('Authors created:', author1.name, author2.name, author3.name)

  const posts = [
    {
      _id: 'post-rks-velocity-launch',
      _type: 'blogPost',
      title: 'Introducing the RKS Velocity — Our Fastest E-Bike Yet',
      slug: { _type: 'slug', current: 'introducing-rks-velocity-fastest-e-bike' },
      category: 'launches',
      isFeatured: true,
      publishedDate: '2026-06-20T09:00:00Z',
      excerpt: 'The RKS Velocity redefines what an e-bike can do: 48V smart motor, 120km range, hydraulic disc brakes, and a Shimano 9-speed drivetrain — all wrapped in a hand-welded Italian alloy frame.',
      tags: ['Velocity', 'New Model', 'Launch', 'Electric'],
      author: { _type: 'reference', _ref: 'author-luca-romani' },
      body: [
        block('The RKS Velocity — Our Fastest E-Bike Yet', 'h2'),
        block('After two years of engineering and testing, we are proud to unveil the RKS Velocity. Built for riders who demand performance without compromise, the Velocity pushes every limit we set for ourselves.'),
        block('Performance & Range', 'h3'),
        block('At the heart of the Velocity is our new 48V 750W mid-drive motor, tuned for instant torque delivery across all five pedal-assist modes. Whether you are climbing mountain passes or cruising city boulevards, the motor responds predictably and powerfully.'),
        block('The 17.5Ah lithium battery delivers a real-world range of up to 120km on a single charge — tested at 25km/h average on mixed terrain. A full charge takes just 4.5 hours with the included 4A charger.'),
        block('Italian Engineering, Global Standards', 'h3'),
        block('The frame is hand-welded from 6061 aluminium alloy at our facility in Bergamo, Italy. Every weld is inspected to aerospace tolerances before moving to the paint line, where seven layers of lacquer are applied by hand.'),
        block('Braking is handled by Tektro hydraulic disc brakes front and rear — 180mm rotors that shed speed with absolute confidence in all weather conditions. Gearing is a Shimano Alivio 9-speed, renowned for smooth, reliable shifting under power.'),
        block('Smart Connectivity', 'h3'),
        block('The Velocity connects to the RKS Rider app via Bluetooth, giving you live battery analytics, ride statistics, theft alerts, and over-the-air firmware updates. The integrated LCD dashboard displays speed, distance, battery level, and assist mode at a glance.'),
        block('Available from September 2026. Pre-register your interest on our models page.'),
      ],
    },
    {
      _id: 'post-battery-technology-guide',
      _type: 'blogPost',
      title: 'Inside the Battery: How RKS Powers Its E-Bikes',
      slug: { _type: 'slug', current: 'inside-the-battery-how-rks-powers-e-bikes' },
      category: 'technology',
      isFeatured: true,
      publishedDate: '2026-06-14T08:00:00Z',
      excerpt: 'We take you inside the 48V lithium battery cell — from raw chemistry to finished pack — and explain exactly why range, longevity, and charge speed matter more than headline watt-hours.',
      tags: ['Battery', 'Technology', 'Range', '48V'],
      author: { _type: 'reference', _ref: 'author-marco-ferretti' },
      body: [
        block('Inside the Battery: How RKS Powers Its E-Bikes', 'h2'),
        block('When customers ask us about range, they often focus on the watt-hour (Wh) number printed on the spec sheet. But battery performance is far more nuanced — and understanding it helps you choose the right e-bike for your life.'),
        block('Cell Chemistry: Why We Use NMC', 'h3'),
        block('All RKS batteries use NMC (Nickel Manganese Cobalt) lithium cells in a 18650 cylindrical format. NMC strikes the best balance of energy density, thermal stability, and cycle life for e-bike use. Cheaper bikes often use NCA or LFP cells — both have trade-offs in either energy density or temperature performance.'),
        block('Real-World Range vs. Rated Range', 'h3'),
        block('The EU standard test for e-bike range is conducted at 20°C at 25km/h on flat ground with 75kg rider weight. Real-world range can vary by 20–40% depending on hills, wind, temperature, rider weight, tyre pressure, and assist level used.'),
        block('Our 17.5Ah / 840Wh battery pack on the Velocity gives 90–120km in real-world mixed-terrain use at 20–25km/h average. Always plan your ride with 80% of rated range unless you know the exact conditions.'),
        block('Battery Longevity: How to Make It Last', 'h3'),
        block('NMC cells last 800–1000 charge cycles to 80% capacity when treated correctly. Our top tips: never store the battery below 20% charge, avoid leaving it at 100% for extended periods, and keep it between 10°C and 35°C when not in use. Following these guidelines can extend pack life beyond 5 years.'),
        block('Fast Charging: What to Know', 'h3'),
        block('Our standard 4A charger is designed to balance charge speed with cell longevity. Third-party fast chargers above 5A can reduce cycle life significantly. If you need faster turnaround, contact our parts team about the optional 6A dual-port charger, which is engineered specifically for our battery management system.'),
      ],
    },
    {
      _id: 'post-choose-your-first-e-bike',
      _type: 'blogPost',
      title: 'How to Choose Your First E-Bike: The Complete Buyer\'s Guide',
      slug: { _type: 'slug', current: 'how-to-choose-your-first-e-bike-buyers-guide' },
      category: 'lifestyle',
      isFeatured: false,
      publishedDate: '2026-06-07T10:00:00Z',
      excerpt: 'Motor power, battery capacity, frame geometry, assist modes — buying your first e-bike involves more decisions than you think. This guide cuts through the noise.',
      tags: ['Buyer Guide', 'First E-Bike', 'Tips', 'Lifestyle'],
      author: { _type: 'reference', _ref: 'author-sofia-esposito' },
      body: [
        block('How to Choose Your First E-Bike', 'h2'),
        block('The e-bike market has exploded. There are now hundreds of models across every price point and riding style — which makes choosing your first bike both exciting and overwhelming. This guide will help you make the right call.'),
        block('Step 1: Define Your Riding Style', 'h3'),
        block('The single biggest decision is how you will use the bike. City commuting demands upright geometry, mudguards, a rear rack, and puncture-resistant tyres. Long-distance touring needs maximum range and ergonomic comfort. Off-road trails require a full-suspension setup and wider knobby tyres. Most riders fall into one or two of these categories — be honest about your actual use, not your aspirational use.'),
        block('Step 2: Motor Position — Hub vs. Mid-Drive', 'h3'),
        block('Hub motors (in the rear wheel) are simpler, cheaper, and quieter, but they do not interact with the gears. Mid-drive motors (at the pedal cranks) use your gears for maximum efficiency — they climb hills better and deliver a more natural riding feel. For any serious use beyond flat city streets, we recommend mid-drive.'),
        block('Step 3: Battery — How Much Do You Need?', 'h3'),
        block('As a rough rule: 400Wh covers 40–60km of real-world riding. 500–600Wh covers 60–90km. 800Wh+ covers 90–130km. Buy more capacity than you think you need — range anxiety is real, and it is better to arrive with battery to spare.'),
        block('Step 4: Weight Matters', 'h3'),
        block('Most e-bikes weigh 18–28kg. If you need to carry the bike upstairs, this matters enormously. Lightweight alloy or carbon frames cost more but make daily handling much easier. Check the lifting weight before you buy.'),
        block('Step 5: Test Ride Before You Buy', 'h3'),
        block('No spec sheet replaces 20 minutes in the saddle. Visit one of our authorised dealers to test the models you are considering. Pay attention to how the assist feels, how the brakes respond, and whether the geometry suits your body. Our dealer team will happily adjust saddle height and handlebar reach on the spot.'),
      ],
    },
    {
      _id: 'post-eurobike-2026',
      _type: 'blogPost',
      title: 'RKS at Eurobike 2026 — Here\'s Everything We Showed',
      slug: { _type: 'slug', current: 'rks-at-eurobike-2026-recap' },
      category: 'events',
      isFeatured: false,
      publishedDate: '2026-05-28T07:30:00Z',
      excerpt: 'We had a record presence at Eurobike Frankfurt this year. Here is a full recap of every model, technology demo, and partnership announcement from our stand.',
      tags: ['Eurobike', 'Events', '2026', 'Frankfurt'],
      author: { _type: 'reference', _ref: 'author-sofia-esposito' },
      body: [
        block('RKS at Eurobike 2026 — Full Recap', 'h2'),
        block('Eurobike 2026 in Frankfurt was our biggest international exhibition yet. Over four days, more than 6,000 visitors passed through our 280 square metre stand — and we had a lot to show them.'),
        block('World Premiere: RKS Velocity', 'h3'),
        block('The undisputed highlight was the world premiere of the RKS Velocity. We unveiled the production model on the opening morning alongside a live technical presentation from our head of engineering, Luca Romani. The response from press and distributors exceeded all expectations — we took more than 400 pre-registrations at the show alone.'),
        block('Battery Swap Technology Demo', 'h3'),
        block('We demonstrated our prototype battery swap system, which allows hot-swappable 17.5Ah packs in under 90 seconds without tools. This technology is designed for fleet and rental operators where downtime is critical. We are targeting a commercial release in Q2 2027.'),
        block('New B2B Partnership Announcements', 'h3'),
        block('We signed distribution agreements with partners in Germany, the Netherlands, and South Korea at the show. These deals bring our authorised dealer network to 34 countries. If you are interested in becoming a distributor in your region, see our Trade Partner page.'),
        block('What\'s Coming Next', 'h3'),
        block('We cannot say too much yet, but visitors who stopped by our private meeting room got a preview of a new cargo e-bike model we are developing for urban logistics operators. More details before the end of 2026.'),
      ],
    },
    {
      _id: 'post-dealer-network-expansion',
      _type: 'blogPost',
      title: 'RKS Expands Dealer Network to 34 Countries',
      slug: { _type: 'slug', current: 'rks-dealer-network-expansion-34-countries' },
      category: 'news',
      isFeatured: false,
      publishedDate: '2026-05-15T09:00:00Z',
      excerpt: 'New authorised dealers across Germany, the Netherlands, South Korea, and Brazil mean Italian-engineered e-bikes are now closer to riders in more than 34 countries worldwide.',
      tags: ['Dealers', 'Expansion', 'Global', 'Distribution'],
      author: { _type: 'reference', _ref: 'author-sofia-esposito' },
      body: [
        block('RKS Dealer Network Reaches 34 Countries', 'h2'),
        block('We are proud to announce the expansion of our authorised dealer network following a series of new distribution agreements signed at Eurobike 2026. RKS e-bikes are now available through certified dealers in 34 countries across Europe, Asia, and South America.'),
        block('New Markets', 'h3'),
        block('The latest agreements bring on board key distributors in Germany (4 new dealer locations in Berlin, Munich, Hamburg, and Cologne), the Netherlands (2 locations in Amsterdam and Rotterdam), South Korea (a national master distributor with 12 existing premium bike stores), and Brazil (São Paulo and Rio de Janeiro).'),
        block('What Authorised Dealer Status Means', 'h3'),
        block('All RKS authorised dealers are required to complete factory training, carry a minimum stock of genuine OEM parts, provide warranty service, and meet our customer experience standards. When you buy from an authorised dealer, you are guaranteed a genuine product, proper setup, and ongoing service support.'),
        block('Become a Dealer', 'h3'),
        block('We are actively seeking distribution partners in Canada, Australia, Japan, and the Middle East. If you operate a premium cycle or electric mobility retail business, we would love to hear from you. Visit our Trade Partner page to begin the application process.'),
      ],
    },
    {
      _id: 'post-ebike-urban-mobility',
      _type: 'blogPost',
      title: '5 Reasons E-Bikes Are Transforming Urban Mobility',
      slug: { _type: 'slug', current: '5-reasons-e-bikes-transforming-urban-mobility' },
      category: 'lifestyle',
      isFeatured: false,
      publishedDate: '2026-05-01T11:00:00Z',
      excerpt: 'From cutting commute times to reducing city emissions, e-bikes are reshaping how people move through cities. Here are five reasons the shift is irreversible.',
      tags: ['Urban', 'Commuting', 'Sustainability', 'Lifestyle'],
      author: { _type: 'reference', _ref: 'author-sofia-esposito' },
      body: [
        block('5 Reasons E-Bikes Are Transforming Urban Mobility', 'h2'),
        block('Every major city in Europe is seeing the same trend: e-bike sales are surging while car registrations are flat or declining. This is not a niche phenomenon — it is a structural shift in how people choose to move. Here is why.'),
        block('1. They Beat Cars in City Traffic', 'h3'),
        block('A 2025 study across 12 European cities found that e-bikes were faster than cars for journeys under 8km when door-to-door time was measured. You skip the traffic queue, park at the door, and cover the last mile instantly. For most urban commutes, the e-bike is simply the fastest option.'),
        block('2. The Running Cost Is Negligible', 'h3'),
        block('Charging a 500Wh battery costs approximately €0.15 at average European electricity prices. At 60km range, that is less than €0.003 per kilometre — compared to €0.12–0.20 per kilometre for a typical petrol car. An e-bike pays for itself in avoided fuel costs within 2–3 years for a regular commuter.'),
        block('3. Health Benefits Are Real', 'h3'),
        block('Contrary to the perception that motor assist removes exercise, research shows e-bike commuters exercise more than car commuters and similar amounts to regular cyclists — they simply travel further. The assist mode means you arrive at the office without being drenched in sweat, which removes one of the main practical barriers to cycling to work.'),
        block('4. Zero Direct Emissions', 'h3'),
        block('Even accounting for electricity generation, e-bikes produce 10–20 times fewer CO₂ emissions per kilometre than a petrol car. In cities where electricity comes primarily from renewables, the carbon footprint approaches zero. For individuals who want to reduce their personal environmental impact immediately, switching a car commute to an e-bike is one of the single most effective changes they can make.'),
        block('5. Infrastructure Is Catching Up Fast', 'h3'),
        block('Cycle lanes, secure parking, and charging infrastructure are being built at record pace across Europe. Amsterdam, Copenhagen, and Paris have already transformed their city centres. London, Berlin, and Milan are following. The infrastructure argument for avoiding e-bikes is weakening every year.'),
        block('The question is no longer whether to switch to an e-bike. It is which one — and we are happy to help you choose.'),
      ],
    },
  ]

  console.log('\nSeeding blog posts...')
  for (const post of posts) {
    const result = await client.createOrReplace(post)
    console.log(`✓ Created: "${result.title}"`)
  }

  console.log('\n✅ Seed complete — 2 authors + 6 blog posts created in Sanity.')
  console.log('   Open Sanity Studio → Blog Posts to see them.')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
