import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'CeloSwap Mini | Quick Token Swaps',
  description: 'Instant token swaps on Celo with minimal fees',
  openGraph: {
    title: 'CeloSwap Mini',
    description: 'Instant token swaps on Celo with minimal fees',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CeloSwap Mini',
    description: 'Instant token swaps on Celo with minimal fees',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
