import { NextResponse } from 'next/server'

export async function GET() {
  // Crear un SVG simple con fondo negro y letra B
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#000000"/>
      <text 
        x="600" 
        y="350" 
        font-family="Inter, sans-serif" 
        font-size="200" 
        font-weight="900" 
        fill="#FFFFFF" 
        text-anchor="middle" 
        letter-spacing="0.1em"
      >
        B
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}









