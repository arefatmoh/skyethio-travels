"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Plane, Globe, Phone, User, MapPin, Calendar, Info, CreditCard, Package as PackageIcon, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/useTranslation"
import { Locale, localeNames } from "@/locales"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Announcement bar hide-on-scroll
  const [isAnnouncementHidden, setIsAnnouncementHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const pathname = usePathname()
  const { t, locale, switchLanguage } = useTranslation()
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const isNowScrolled = currentY > 50
      setScrolled(isNowScrolled)

      // Announcement hide on scroll down, show on scroll up
      if (currentY > lastScrollY && currentY > 50) {
        setIsAnnouncementHidden(true)
      } else {
        setIsAnnouncementHidden(false)
      }
      setLastScrollY(currentY)

      // Scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (currentY / docHeight) * 100)) : 0
      setProgress(pct)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navItems = [
    { 
      href: "/", 
      label: t("navigation.home"), 
      icon: <Plane className="h-4 w-4" />,
      description: t("navigation.homeDescription"),
    },
    { 
      href: "/about", 
      label: t("navigation.about"), 
      icon: <Info className="h-4 w-4" />,
      description: t("navigation.aboutDescription"),
    },
    { 
      href: "/services", 
      label: t("navigation.services"), 
      icon: <Globe className="h-4 w-4" />,
      description: t("navigation.servicesDescription"),
      submenu: [
        { label: t("navigation.submenu.flightBooking"), icon: <Plane className="h-4 w-4" /> },
        { label: t("navigation.submenu.hotelReservations"), icon: <MapPin className="h-4 w-4" /> },
        { label: t("navigation.submenu.cargoServices"), icon: <PackageIcon className="h-4 w-4" /> },
      ]
    },
    { 
      href: "/book-ticket", 
      label: t("navigation.bookTicket"), 
      icon: <Calendar className="h-4 w-4" />,
      description: t("navigation.bookTicketDescription"),
    },
    { 
      href: "/visa-application", 
      label: t("navigation.visa"), 
      icon: <FileText className="h-4 w-4" />,
      description: t("navigation.visaDescription"),
    },
    { 
      href: "/contact", 
      label: t("navigation.contact"), 
      icon: <Phone className="h-4 w-4" />,
      description: t("navigation.contactDescription"),
    },
  ]

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-gradient-to-r from-slate-900/90 via-blue-950/85 to-purple-950/90 backdrop-blur-xl border-b border-white/20 shadow-lg" 
        : "bg-gradient-to-r from-slate-900/70 via-blue-950/65 to-purple-950/70 backdrop-blur-md border-b border-white/10"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Announcement Bar */}
        {showAnnouncement && (
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isAnnouncementHidden ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
          )}>
            <div className="flex items-center justify-between text-xs sm:text-sm text-cyan-100/90 py-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-200 border border-cyan-400/20">{t("homepage.announcement.new")}</span>
                <p className="font-poppins">
                  {t("homepage.announcement.specialFares")}
                  <Link href="/book-ticket" className="ml-2 underline decoration-cyan-400/60 underline-offset-4 hover:text-white">{t("homepage.announcement.bookNow")}</Link>
                </p>
              </div>
              <button aria-label="Dismiss announcement" onClick={() => setShowAnnouncement(false)} className="text-cyan-200/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className={cn(
          "flex justify-between items-center transition-all duration-300",
          scrolled ? "h-16" : "h-20"
        )}>
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="p-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 via-blue-400/30 to-purple-400/30 animate-pulse"></div>
              <Plane className="h-6 w-6 text-white relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-playfair font-bold text-xl bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
                SkyEthio
              </span>
              <span className="text-xs text-cyan-200/80 -mt-1 font-poppins font-medium">Travels & Cargo</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <HoverCard key={item.href} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-lg flex items-center space-x-1.5 transition-all duration-300 group",
                        isActive 
                          ? "text-white bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-md" 
                          : "text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-900/10 hover:via-blue-900/10 hover:to-purple-900/10"
                      )}
                    >
                      <span className={cn(
                        "absolute inset-0 rounded-lg transition-opacity duration-300",
                        isActive ? "bg-gradient-to-r from-cyan-600/15 via-blue-600/15 to-purple-600/15 opacity-100" : "opacity-0 group-hover:opacity-50"
                      )}></span>
                      <span className={cn(
                        "relative z-10 transition-all duration-300",
                        isActive ? "text-cyan-400" : "text-cyan-300 group-hover:text-cyan-400"
                      )}>
                        {item.icon}
                      </span>
                      <span className="relative z-10 font-poppins">{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 transform -translate-x-1/2 rounded-full"></span>
                      )}
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-cyan-500/20 shadow-xl text-white p-4 w-56 animate-in fade-in-50 duration-200"
                    side="bottom"
                    align="start"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-md shadow-inner shadow-white/5">
                          {item.icon}
                        </div>
                        <h4 className="font-playfair font-medium text-transparent bg-gradient-to-r from-cyan-200 to-white bg-clip-text">{item.label}</h4>
                      </div>
                      <p className="text-sm font-poppins text-cyan-100/80">{item.description}</p>
                      {item.submenu && (
                        <div className="pt-2 mt-2 border-t border-cyan-500/20 space-y-1.5">
                          {item.submenu.map((subitem, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-cyan-100/80 hover:text-white transition-colors duration-200 py-1 group">
                              <span className="text-cyan-400 group-hover:text-cyan-300">{subitem.icon}</span>
                              <span className="group-hover:translate-x-0.5 transition-transform duration-200">{subitem.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20">
                  <Globe className="h-4 w-4" />
                  {localeNames[locale]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 border border-cyan-500/20 text-cyan-100">
                <DropdownMenuItem 
                  className="focus:bg-white/10 cursor-pointer"
                  onClick={() => switchLanguage('en')}
                >
                  EN — English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="focus:bg-white/10 cursor-pointer"
                  onClick={() => switchLanguage('am')}
                >
                  AM — አማርኛ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Phone CTA */}
            <Link href="tel:+2519627654530000000" aria-label="Call SkyEthio">
              <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-full shadow-md border border-white/20 transition-all duration-300">
                <Phone className="mr-2 h-4 w-4 text-cyan-600" />
                <span className="font-poppins text-cyan-700">+251962765453</span>
              </Button>
            </Link>
            <Link href="/book-ticket">
              <Button className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <Plane className="mr-2 h-4 w-4 animate-pulse" />
                <span className="font-poppins">{t("navigation.bookNow")}</span>
              </Button>
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {isOpen ? <X className="h-6 w-6 relative z-10" /> : <Menu className="h-6 w-6 relative z-10" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-3 pt-3 pb-4 space-y-2 bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl rounded-xl mt-2 border border-cyan-500/20 shadow-xl animate-in fade-in slide-in-from-top duration-300">
              {/* Quick actions */}
              <div className="flex items-center gap-2 px-2">
                <Link href="tel:+2519627654530000000" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full border-cyan-500/40 text-cyan-100 hover:text-white hover:border-cyan-400/60">
                    <Phone className="h-4 w-4" /> {t("navigation.callUs")}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-cyan-100 hover:text-white"><Globe className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-slate-900/95 border border-cyan-500/20 text-cyan-100">
                    <DropdownMenuItem 
                      className="focus:bg-white/10 cursor-pointer"
                      onClick={() => switchLanguage('en')}
                    >
                      EN — English
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="focus:bg-white/10 cursor-pointer"
                      onClick={() => switchLanguage('am')}
                    >
                      AM — አማርኛ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-300",
                      isActive
                        ? "text-white bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 shadow-inner"
                        : "text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-900/10 hover:via-blue-900/10 hover:to-purple-900/10"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={cn(
                      "p-2 rounded-lg transition-colors duration-300",
                      isActive 
                        ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-inner shadow-white/5" 
                        : "bg-slate-800/70 text-cyan-300"
                    )}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="pt-2 mt-2 border-t border-cyan-500/20">
                <Link href="/book-ticket" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white py-6 rounded-lg shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300">
                    <Plane className="mr-2 h-5 w-5 animate-pulse" />
                    {t("navigation.bookNow")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Progress Bar */}
      <div className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>
    </nav>
  )
}
