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
      <body suppressHydrationWarning className={`${playfair.variable} ${poppins.variable} font-poppins`}>
        <LanguageProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
          <SocialWrapper />
          <AdImporter />
          <AdManager currentPage="/" isNewVisitor={true} />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
