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
  title: 'Bunker Productions - Immersive Light & Sound Experiences',
  description: 'We design immersive light and sound experiences for events, clubs, festivals, and commercial spaces. From concept to execution — transforming spaces through technology, art, and community.',
  keywords: ['light shows', 'sound design', 'event production', 'mapping', 'DMX lighting', 'pixel mapping', 'immersive experiences', 'Malmö', 'Copenhagen', 'NGBG', 'community hub'],
  authors: [{ name: 'Bunker Productions' }],
  creator: 'Bunker Productions',
  publisher: 'Bunker Productions',
  metadataBase: new URL('https://lightmvp.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bunker Productions - Immersive Light & Sound Experiences',
    description: 'We design immersive light and sound experiences for events, clubs, festivals, and commercial spaces. From concept to execution — transforming spaces through technology, art, and community.',
    url: 'https://lightmvp.vercel.app',
    siteName: 'Bunker Productions',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bunker Productions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bunker Productions - Immersive Light & Sound Experiences',
    description: 'We design immersive light and sound experiences for events, clubs, festivals, and commercial spaces.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    <html lang="en" suppressHydrationWarning>
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
                
                // Update lang attribute based on saved language
                const savedLanguage = localStorage.getItem('language');
                if (savedLanguage && ['es', 'sv', 'en'].includes(savedLanguage)) {
                  document.documentElement.lang = savedLanguage === 'es' ? 'es' : savedLanguage === 'sv' ? 'sv' : 'en';
                }
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
