import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProvider } from '@/lib/context'
import { Navigation } from '@/components/navigation'
import { JelesChatWidget } from '@/components/jeles-chat-widget'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PatternBreaker Addis | Break Your Patterns',
  description: 'Challenge your patterns with AI-powered insights from four unique perspectives.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background dark">
      <body className="font-sans antialiased bg-black text-white">
        <AppProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <JelesChatWidget 
            primaryColor="#ff5c00"
            secondaryColor="#ff0099"
            position="bottom-right"
            agentName="Jeles"
            greeting="Hi! How can I help you today?"
          />
        </AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
