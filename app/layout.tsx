import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  title: "CntpdLab — Premium Full-Stack Developer",
  description: "Full-stack developer (Python, Next.js, Telegram bots). I build fast MVPs and production-ready apps.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "CntpdLab — Premium Full-Stack Developer",
    description:
      "Full-stack developer (Python, Next.js, Telegram bots). I build fast MVPs and production-ready apps.",
    url: siteUrl,
    siteName: "CntpdLab",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CntpdLab — Premium Full-Stack Developer",
    description:
      "Full-stack developer (Python, Next.js, Telegram bots). I build fast MVPs and production-ready apps.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <body
        className={`relative min-h-screen bg-black font-sans text-white antialiased [background-image:radial-gradient(900px_450px_at_20%_0%,rgba(16,185,129,.14),transparent),radial-gradient(800px_400px_at_80%_-10%,rgba(124,58,237,.12),transparent),linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:auto,auto,24px_24px,24px_24px] [background-repeat:no-repeat,no-repeat,repeat,repeat]`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[.06] mix-blend-overlay"
        />
        <div className="relative flex min-h-screen flex-col">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  )
}
