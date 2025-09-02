import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Poppins } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import SocialWrapper from "./social-wrapper"
import { Toaster } from "@/components/ui/sonner"
import { AdManager } from "@/components/ads/AdManager"
import { AdImporter } from "@/components/ads/AdImporter"
import { LanguageProvider } from "@/contexts/LanguageContext"
import LanguageChooserWrapper from "@/components/LanguageChooserWrapper"

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
})

export const metadata: Metadata = {
  title: "SkyEthio Travels & Cargo - Premium Travel Services",
  description:
    "From Ethiopia to Your Desired Destination - Premium travel and cargo services with world-class airlines",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="icon" href="/icon.svg?v=2" type="image/svg+xml" />
        <link rel="icon" href="/icon.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body suppressHydrationWarning className={`${playfair.variable} ${poppins.variable} font-poppins`}>
        <LanguageProvider>
          <LanguageChooserWrapper>
            <Navigation />
            <main className="pt-16">{children}</main>
            <SocialWrapper />
            <AdImporter />
            <AdManager currentPage="/" isNewVisitor={true} />
            <Toaster />
          </LanguageChooserWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
