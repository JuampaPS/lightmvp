import type { Metadata } from 'next'
import { Inter, Teko } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const teko = Teko({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-teko'
})

export const metadata: Metadata = {
  title: 'Bunker Productions - Creación y diseño de espacios',
  description: 'Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${teko.variable}`}>{children}</body>
    </html>
  )
}
