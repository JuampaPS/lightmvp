import type { Metadata } from 'next'
import { Inter, Teko } from 'next/font/google'
import './globals.css'
import { LoaderWrapper } from '@/components/LoaderWrapper'

const inter = Inter({ subsets: ['latin'] })
const teko = Teko({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-teko'
})

export const metadata: Metadata = {
  title: 'Bunker Productions - Creación y diseño de espacios',
  description: 'Diseñamos experiencias inmersivas de luz y sonido para eventos, clubes, festivales y espacios comerciales.',
  other: {
    'format-detection': 'telephone=no',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${teko.variable}`}>
        <LoaderWrapper />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('scrollRestoration' in window.history) {
                  window.history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
