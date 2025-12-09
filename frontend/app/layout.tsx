import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuroraBg } from "@/components/aurora-bg"
import { ToastProvider, ToastViewport } from '@/components/ui/toast'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clause Sense - AI Legal Document Analyzer",
  description:
    "Transform dense legal documents into clear insights. Detect anomalies, summarize complexities, and understand every clause in seconds.",
  generator: "Clause Sense",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ToastProvider>
          <AuroraBg />
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}
