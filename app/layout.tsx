import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zano Investment Monitor",
  description: "Professional cryptocurrency investment tracking dashboard for ZANO",
  keywords: "cryptocurrency, ZANO, investment, monitoring, dashboard, portfolio",
  authors: [{ name: "mtmarctoni", url: "https://marctonimas.com" }],
  creator: "Marc Tonimas",
  openGraph: {
    title: "Zano Investment Monitor",
    description: "Professional cryptocurrency investment tracking dashboard for ZANO",
    url: "https://zano-monitor.vercel.app/",
    siteName: "Zano Investment Monitor",
    images: [
      {
        url: "https://zano-monitor.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zano Investment Monitor OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zano Investment Monitor",
    description: "Professional cryptocurrency investment tracking dashboard for ZANO",
    images: ["https://zano-monitor.vercel.app/og-image.png"],
    creator: "@mtmarctoni",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
