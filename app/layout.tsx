import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TOHI PatternBreaker Addis',
  description: 'Break your stuck patterns with AI-powered 24-hour city challenges. Built for young people in Addis Ababa.',
  keywords: ['Addis Ababa', 'life coach', 'AI', 'habits', 'pattern breaking', 'Ethiopia'],
  openGraph: {
    title: 'TOHI PatternBreaker Addis',
    description: 'Break your loop. Start a new pattern. — አዲስ መንገድ ጀምር',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F0F1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0F0F1A]" style={{ colorScheme: 'dark' }}>
      <body className={`${spaceGrotesk.className} antialiased bg-[#0F0F1A] text-white`}>
        {children}
      </body>
    </html>
  )
}
