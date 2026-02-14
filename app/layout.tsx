import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Piles - Media Management',
  description: 'Manage your movies, series, music and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
