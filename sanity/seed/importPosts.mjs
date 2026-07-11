/**
 * Imports blog posts directly via the Sanity HTTP Mutations API.
 * No CLI needed — uses Node 18 built-in fetch.
 * Run: node sanity/seed/importPosts.mjs
 */

const PROJECT_ID = 'f3zi3siz'
const DATASET    = 'production'
const TOKEN      = 'skCokcXeHjy0bvustRJFE2PCYDbkjoIiZSRL374jmrhYIwhi6XbV3L2lyq2PUVTPu9jSj5BqiVw9rQxymHKPMRgPt5cVlz14G64XV0jTMhhVtkRBHU2jcLrfLfpnlDz9cGhp1u38YGzctTsVcysBIH8tppmm2c0oUmHZKYlAdspEQ7SuD8g2'
const API        = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`

function b(text, style = 'normal', key) {
  return {
    _type: 'block', _key: key,
    style,
    children: [{ _type: 'span', _key: key + 's', text, marks: [] }],
    markDefs: [],
  }
}

const documents = [
  // ── Authors ───────────────────────────────────────────────────────────────
  {
    _id: 'author-luca-romani', _type: 'author',
    name: 'Luca Romani', role: 'Head of Product & Technology',
    bio: 'Luca has spent 12 years in the electric mobility industry, leading product development at RKS. He specialises in battery systems and smart motor technology.',
  },
  {
    _id: 'author-sofia-esposito', _type: 'author',
    name: 'Sofia Esposito', role: 'Brand & Content Manager',
    bio: 'Sofia leads the RKS brand story with a passion for sustainable transport and Italian design culture.',
  },
  {
    _id: 'author-marco-ferretti', _type: 'author',
    name: 'Marco Ferretti', role: 'Technical Editor',
    bio: 'Marco covers e-bike technology in depth — from drivetrain mechanics to battery chemistry and smart connectivity.',
  },

  // ── Blog Posts ────────────────────────────────────────────────────────────
  {
    _id: 'post-rks-velocity-launch', _type: 'blogPost',
    title: 'Introducing the RKS Velocity — Our Fastest E-Bike Yet',
    slug: { _type: 'slug', current: 'introducing-rks-velocity-fastest-e-bike' },
    category: 'launches', isFeatured: true,
    publishedDate: '2026-06-20T09:00:00Z',
    excerpt: 'The RKS Velocity redefines what an e-bike can do: 48V smart motor, 120km range, hydraulic disc brakes, and a Shimano 9-speed drivetrain — all wrapped in a hand-welded Italian alloy frame.',
    tags: ['Velocity', 'New Model', 'Launch', 'Electric'],
    author: { _type: 'reference', _ref: 'author-luca-romani' },
    body: [
      b('The RKS Velocity — Our Fastest E-Bike Yet', 'h2', 'a1'),
      b('After two years of engineering and testing, we are proud to unveil the RKS Velocity. Built for riders who demand performance without compromise, the Velocity pushes every limit we set for ourselves.', 'normal', 'a2'),
      b('Performance & Range', 'h3', 'a3'),
      b('At the heart of the Velocity is our new 48V 750W mid-drive motor, tuned for instant torque delivery across all five pedal-assist modes. Whether you are climbing mountain passes or cruising city boulevards, the motor responds predictably and powerfully.', 'normal', 'a4'),
      b('The 17.5Ah lithium battery delivers a real-world range of up to 120km on a single charge — tested at 25km/h average on mixed terrain. A full charge takes just 4.5 hours with the included 4A charger.', 'normal', 'a5'),
      b('Italian Engineering, Global Standards', 'h3', 'a6'),
      b('The frame is hand-welded from 6061 aluminium alloy at our facility in Bergamo, Italy. Every weld is inspected to aerospace tolerances before moving to the paint line, where seven layers of lacquer are applied by hand.', 'normal', 'a7'),
      b('Smart Connectivity', 'h3', 'a8'),
      b('The Velocity connects to the RKS Rider app via Bluetooth, giving you live battery analytics, ride statistics, theft alerts, and over-the-air firmware updates.', 'normal', 'a9'),
    ],
  },
  {
    _id: 'post-battery-technology', _type: 'blogPost',
    title: 'Inside the Battery: How RKS Powers Its E-Bikes',
    slug: { _type: 'slug', current: 'inside-the-battery-how-rks-powers-e-bikes' },
    category: 'technology', isFeatured: true,
    publishedDate: '2026-06-14T08:00:00Z',
    excerpt: 'We take you inside the 48V lithium battery cell — from raw chemistry to finished pack — and explain exactly why range, longevity, and charge speed matter more than headline watt-hours.',
    tags: ['Battery', 'Technology', 'Range', '48V'],
    author: { _type: 'reference', _ref: 'author-marco-ferretti' },
    body: [
      b('Inside the Battery: How RKS Powers Its E-Bikes', 'h2', 'b1'),
      b('When customers ask us about range, they often focus on the watt-hour (Wh) number printed on the spec sheet. But battery performance is far more nuanced — and understanding it helps you choose the right e-bike for your life.', 'normal', 'b2'),
      b('Cell Chemistry: Why We Use NMC', 'h3', 'b3'),
      b('All RKS batteries use NMC (Nickel Manganese Cobalt) lithium cells in a 18650 cylindrical format. NMC strikes the best balance of energy density, thermal stability, and cycle life for e-bike use.', 'normal', 'b4'),
      b('Real-World Range vs. Rated Range', 'h3', 'b5'),
      b('Real-world range can vary by 20–40% depending on hills, wind, temperature, rider weight, tyre pressure, and assist level used. Always plan your ride with 80% of rated range unless you know the exact conditions.', 'normal', 'b6'),
      b('Battery Longevity: How to Make It Last', 'h3', 'b7'),
      b('NMC cells last 800–1000 charge cycles to 80% capacity when treated correctly. Never store the battery below 20% charge, avoid leaving it at 100% for extended periods, and keep it between 10°C and 35°C when not in use.', 'normal', 'b8'),
    ],
  },
  {
    _id: 'post-first-ebike-guide', _type: 'blogPost',
    title: "How to Choose Your First E-Bike: The Complete Buyer's Guide",
    slug: { _type: 'slug', current: 'how-to-choose-your-first-e-bike-buyers-guide' },
    category: 'lifestyle', isFeatured: false,
    publishedDate: '2026-06-07T10:00:00Z',
    excerpt: 'Motor power, battery capacity, frame geometry, assist modes — buying your first e-bike involves more decisions than you think. This guide cuts through the noise.',
    tags: ['Buyer Guide', 'First E-Bike', 'Tips', 'Lifestyle'],
    author: { _type: 'reference', _ref: 'author-sofia-esposito' },
    body: [
      b('How to Choose Your First E-Bike', 'h2', 'c1'),
      b('The e-bike market has exploded. There are now hundreds of models across every price point and riding style — which makes choosing your first bike both exciting and overwhelming.', 'normal', 'c2'),
      b('Step 1: Define Your Riding Style', 'h3', 'c3'),
      b('City commuting demands upright geometry, mudguards, and puncture-resistant tyres. Long-distance touring needs maximum range and ergonomic comfort. Off-road trails require a full-suspension setup and wider knobby tyres.', 'normal', 'c4'),
      b('Step 2: Motor Position — Hub vs. Mid-Drive', 'h3', 'c5'),
      b('Hub motors are simpler and cheaper but do not interact with the gears. Mid-drive motors use your gears for maximum efficiency — they climb hills better and deliver a more natural riding feel.', 'normal', 'c6'),
      b('Step 3: Battery — How Much Do You Need?', 'h3', 'c7'),
      b('As a rough rule: 400Wh covers 40–60km, 500–600Wh covers 60–90km, and 800Wh+ covers 90–130km. Buy more capacity than you think you need — range anxiety is real.', 'normal', 'c8'),
    ],
  },
  {
    _id: 'post-eurobike-2026', _type: 'blogPost',
    title: "RKS at Eurobike 2026 — Here's Everything We Showed",
    slug: { _type: 'slug', current: 'rks-at-eurobike-2026-recap' },
    category: 'events', isFeatured: false,
    publishedDate: '2026-05-28T07:30:00Z',
    excerpt: 'We had a record presence at Eurobike Frankfurt this year. Here is a full recap of every model, technology demo, and partnership announcement from our stand.',
    tags: ['Eurobike', 'Events', '2026', 'Frankfurt'],
    author: { _type: 'reference', _ref: 'author-sofia-esposito' },
    body: [
      b('RKS at Eurobike 2026 — Full Recap', 'h2', 'd1'),
      b('Eurobike 2026 in Frankfurt was our biggest international exhibition yet. Over four days, more than 6,000 visitors passed through our 280 square metre stand.', 'normal', 'd2'),
      b('World Premiere: RKS Velocity', 'h3', 'd3'),
      b('The undisputed highlight was the world premiere of the RKS Velocity. We unveiled the production model on the opening morning alongside a live technical presentation. We took more than 400 pre-registrations at the show alone.', 'normal', 'd4'),
      b('New B2B Partnership Announcements', 'h3', 'd5'),
      b('We signed distribution agreements with partners in Germany, the Netherlands, and South Korea at the show. These deals bring our authorised dealer network to 34 countries.', 'normal', 'd6'),
    ],
  },
  {
    _id: 'post-dealer-network', _type: 'blogPost',
    title: 'RKS Expands Dealer Network to 34 Countries',
    slug: { _type: 'slug', current: 'rks-dealer-network-expansion-34-countries' },
    category: 'news', isFeatured: false,
    publishedDate: '2026-05-15T09:00:00Z',
    excerpt: 'New authorised dealers across Germany, the Netherlands, South Korea, and Brazil mean Italian-engineered e-bikes are now closer to riders in more than 34 countries worldwide.',
    tags: ['Dealers', 'Expansion', 'Global', 'Distribution'],
    author: { _type: 'reference', _ref: 'author-sofia-esposito' },
    body: [
      b('RKS Dealer Network Reaches 34 Countries', 'h2', 'e1'),
      b('We are proud to announce the expansion of our authorised dealer network following a series of new distribution agreements signed at Eurobike 2026.', 'normal', 'e2'),
      b('New Markets', 'h3', 'e3'),
      b('New distributors in Germany (4 locations), the Netherlands, South Korea (national master distributor), and Brazil (São Paulo and Rio de Janeiro).', 'normal', 'e4'),
    ],
  },
  {
    _id: 'post-urban-mobility', _type: 'blogPost',
    title: '5 Reasons E-Bikes Are Transforming Urban Mobility',
    slug: { _type: 'slug', current: '5-reasons-e-bikes-transforming-urban-mobility' },
    category: 'lifestyle', isFeatured: false,
    publishedDate: '2026-05-01T11:00:00Z',
    excerpt: 'From cutting commute times to reducing city emissions, e-bikes are reshaping how people move through cities. Here are five reasons the shift is irreversible.',
    tags: ['Urban', 'Commuting', 'Sustainability', 'Lifestyle'],
    author: { _type: 'reference', _ref: 'author-sofia-esposito' },
    body: [
      b('5 Reasons E-Bikes Are Transforming Urban Mobility', 'h2', 'f1'),
      b('Every major city in Europe is seeing the same trend: e-bike sales are surging while car registrations are flat or declining.', 'normal', 'f2'),
      b('1. They Beat Cars in City Traffic', 'h3', 'f3'),
      b('A 2025 study found that e-bikes were faster than cars for journeys under 8km when door-to-door time was measured.', 'normal', 'f4'),
      b('2. The Running Cost Is Negligible', 'h3', 'f5'),
      b('Charging a 500Wh battery costs approximately €0.15. At 60km range, that is less than €0.003 per kilometre — compared to €0.12–0.20 per km for a typical petrol car.', 'normal', 'f6'),
      b('3. Health Benefits Are Real', 'h3', 'f7'),
      b('Research shows e-bike commuters exercise more than car commuters. The assist mode means you arrive without being drenched in sweat.', 'normal', 'f8'),
      b('4. Zero Direct Emissions', 'h3', 'f9'),
      b('E-bikes produce 10–20 times fewer CO₂ emissions per kilometre than a petrol car. Switching a car commute to an e-bike is one of the most effective personal changes you can make.', 'normal', 'f10'),
      b('5. Infrastructure Is Catching Up Fast', 'h3', 'f11'),
      b('Cycle lanes, secure parking, and charging infrastructure are being built at record pace across Europe. The infrastructure argument against e-bikes weakens every year.', 'normal', 'f12'),
    ],
  },
]

async function mutate(docs) {
  const mutations = docs.map(doc => ({ createOrReplace: doc }))
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${JSON.stringify(json)}`)
  }
  return json
}

async function run() {
  console.log('Importing to Sanity via HTTP API...\n')
  const result = await mutate(documents)
  const created = result.results?.length ?? 0
  console.log(`✅ Done — ${created} documents created/updated in Sanity.`)
  console.log('   Open Sanity Studio → Blog Posts to see them.')
}

run().catch(err => {
  console.error('❌ Import failed:', err.message)
  process.exit(1)
})
