import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: 'DisasterGuard AI - Smart Disaster Prediction & Emergency Alert System',
  description: 'AI-powered disaster prediction and emergency management system for Pakistan with real-time monitoring, weather tracking, and intelligent alerts.',
  keywords: ['disaster management', 'AI prediction', 'emergency alerts', 'Pakistan', 'flood monitoring', 'weather tracking'],
}

export const viewport: Viewport = {
  themeColor: '#0a0d14',
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-background`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
