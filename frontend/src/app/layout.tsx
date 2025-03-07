import React from 'react'
import './reset.css'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Navbar from '../components/Navbar'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Rival Radar AI - Competitor Analysis Platform',
  description: 'AI-powered competitor analysis platform that provides strategic insights and competitive intelligence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div className="min-h-screen bg-apple-gray-50">
            <Navbar />
            <main className="apple-container py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
} 