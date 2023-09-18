import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Block Puzzle Game',
  description: 'A block puzzle game for educational purposes',
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
