import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'RKS'
    const subtitle = searchParams.get('subtitle') || 'Premium Italian Motorcycles'
    const type = searchParams.get('type') || 'general'
    const price = searchParams.get('price')
    const specs = searchParams.get('specs')
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1d3557',
            background: 'linear-gradient(135deg, #1d3557 0%, #e63946 100%)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '60px',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <span
                style={{
                  color: '#e63946',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                MB
              </span>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              RKS
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              maxWidth: '800px',
              padding: '0 60px',
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: type === 'model' ? '64px' : '72px',
                fontWeight: 'bold',
                margin: '0',
                lineHeight: '1.1',
                textAlign: 'center',
                background: 'linear-gradient(to bottom right, #ffffff, #ffd166)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                margin: '20px 0 40px 0',
                opacity: 0.9,
                textAlign: 'center',
              }}
            >
              {subtitle}
            </p>

            {/* Type-specific content */}
            {type === 'model' && (
              <div
                style={{
                  display: 'flex',
                  gap: '40px',
                  marginTop: '20px',
                }}
              >
                {price && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '20px 30px',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '16px', opacity: 0.8 }}>Price from</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{price}</div>
                  </div>
                )}
                {specs && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '20px 30px',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '16px', opacity: 0.8 }}>Engine</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{specs}</div>
                  </div>
                )}
              </div>
            )}

            {type === 'news' && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px 30px',
                  borderRadius: '12px',
                  fontSize: '24px',
                  fontWeight: '600',
                }}
              >
                📰 Latest News
              </div>
            )}

            {type === 'parts' && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px 30px',
                  borderRadius: '12px',
                  fontSize: '24px',
                  fontWeight: '600',
                }}
              >
                🔧 Genuine Parts & Accessories
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              opacity: 0.6,
              fontSize: '48px',
            }}
          >
            🏍️
          </div>

          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '60px',
              opacity: 0.3,
              fontSize: '24px',
            }}
          >
            🇮🇹
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '60px',
              color: 'white',
              opacity: 0.8,
              fontSize: '18px',
            }}
          >
            Premium Italian Motorcycles Since 1985
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('Failed to generate OG image:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}