import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const clip = (value: string | null, max: number) => {
  const text = (value ?? '').trim()
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/** Default social preview image: GET /api/og?title=…&subtitle=…&eyebrow=… */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = clip(searchParams.get('title'), 60) || 'RKS E-Bikes'
  const subtitle = clip(searchParams.get('subtitle'), 110) || 'Ape Ryder · RKS · Skyjet'
  const eyebrow = clip(searchParams.get('eyebrow'), 40) || 'E-bikes & parts'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 85% 20%, rgba(204,0,0,0.35), transparent 55%)',
          color: '#f5f5f5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              backgroundColor: '#cc0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            RKS
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6 }}>RKS E-BIKES</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, color: '#cc0000', fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase' }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 16, textTransform: 'uppercase' }}>
            {title}
          </div>
          <div style={{ width: 96, height: 6, backgroundColor: '#cc0000', marginTop: 28 }} />
          <div style={{ fontSize: 32, color: '#aaaaaa', marginTop: 28 }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, color: '#777777', letterSpacing: 2 }}>rksitalia.it</div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
