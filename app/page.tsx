'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Hotel, Ticket, FileText, Globe, Package, Shield, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { initCounterAnimation } from '@/components/counter-animation'
import { useTranslation } from "@/hooks/useTranslation"
import LanguageTest from "@/components/LanguageTest"

const logos = [
  { name: "Ethiopian Airlines", src: "/airlines/ethiopian airline.png", width: 400, height: 200 },
  { name: "Air Arabia", src: "/airlines/air arabia.png", width: 200, height: 200 },
  { name: "Fly Dubai", src: "/airlines/fly dubai.png", width: 200, height: 200 },
  { name: "American Airlines", src: "/airlines/american airlines.png", width: 400, height: 200 },
  { name: "Saudia", src: "/airlines/saudia.png", width: 400, height: 200 },
  { name: "Egypt Air", src: "/airlines/egypt air.png", width: 200, height: 200 },
  { name: "Turkish Airlines", src: "/airlines/turkish airlines.png", width: 200, height: 200 },
  { name: "Qatar Airways", src: "/airlines/qatar airways.png", width: 400, height: 200 },
  { name: "Kenyan Airways", src: "/airlines/kenyan airline.png", width: 400, height: 200 },
  { name: "Emirates", src: "/airlines/emirates.png", width: 200, height: 200 },
  { name: "Etihad", src: "/airlines/etihad.png", width: 200, height: 200 },
  { name: "Fly Nas", src: "/airlines/fly nas.png", width: 200, height: 200 },
];

export default function HomePage() {
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [enableMotion, setEnableMotion] = useState(true)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const [whoosh, setWhoosh] = useState(false)
  const { t } = useTranslation()
  
  useEffect(() => {
    // Initialize counter animations
    const cleanup = initCounterAnimation();
    
    // Cleanup on component unmount
    return cleanup;
  }, []);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnableMotion(!media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  // Whoosh effect trigger on mount
  useEffect(() => {
    const t = setTimeout(() => setWhoosh(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Particle trail cursor effect removed per request
  
  // Image cycling effect for all carousel destinations
  useEffect(() => {
    if (
      hoveredDestination &&
      [
        'Saudi Arabia',
        'Dubai, UAE',
        'Qatar',
        'Kuwait',
        'United States',
        'Canada',
        'Thailand',
        'Kenya',
        'Uganda',
      ].includes(hoveredDestination)
    ) {
      const interval = setInterval(() => {
        setImageIndex((prev: number) => (prev + 1) % 4);
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [hoveredDestination]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section
        className="relative h-screen md:min-h-screen flex items-start md:items-center justify-center overflow-hidden"
        onMouseMove={(e) => {
          if (!enableMotion) return
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width - 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5
          setMouse({ x, y })
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>

        {/* Parallax Background Image */}
        <div className="absolute inset-0 opacity-50">
          <Image
            src="/modern-airplane-sunset-clouds.jpg"
            alt="Airplane in motion"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Aurora and light layers */}
        <div
          className="pointer-events-none absolute -inset-20 opacity-40 blur-3xl"
          style={{
            transform: enableMotion ? `translate(${mouse.x * 12}px, ${mouse.y * 12}px)` : undefined,
            transition: 'transform 150ms ease-out',
          }}
        >
          <div className="absolute top-10 left-1/4 w-[32rem] h-[32rem] bg-gradient-to-tr from-cyan-500/40 to-blue-600/30 rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-fuchsia-500/30 to-purple-600/30 rounded-full mix-blend-screen"></div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            transform: enableMotion ? `translate(${mouse.x * -10}px, ${mouse.y * -10}px)` : undefined,
            transition: 'transform 150ms ease-out',
          }}
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 shadow-[0_0_120px_40px_rgba(255,255,255,0.08)]"></div>
        </div>

        {/* Glassmorphism Hero Content */}
        <div ref={heroRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20 md:pt-0 md:mt-[-3rem] animate-in fade-in-50 slide-in-from-bottom-4 w-full">
          <div
            className="relative backdrop-blur-lg bg-white/10 rounded-3xl p-4 md:p-12 border border-white/20 shadow-2xl will-change-transform"
            style={enableMotion ? { transform: `perspective(1000px) rotateX(${mouse.y * -4}deg) rotateY(${mouse.x * 6}deg)` } : undefined}
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-transparent"></div>
            {/* Whoosh streak */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-10 top-1/3 h-24 skew-x-12 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent blur-md"
              style={{ transform: `translateX(${whoosh ? '120%' : '-120%'})`, transition: 'transform 1200ms cubic-bezier(0.22,1,0.36,1)' }}
            />
            <h1 className="text-3xl md:text-7xl font-playfair font-bold text-white mb-2 md:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_6px_30px_rgba(0,0,0,0.3)]">
              {t("homepage.hero.title")}
            </h1>
            <p className="text-sm md:text-2xl font-poppins text-gray-200 mb-4 md:mb-6 font-light">
              {t("homepage.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center will-change-transform" style={enableMotion ? { transform: `perspective(800px) rotateX(${mouse.y * -2}deg) rotateY(${mouse.x * 3}deg)` } : undefined}>
              <Link href="/book-ticket">
                <Button className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-poppins font-medium">
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <Ticket className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {t("homepage.hero.bookTicket")}
                </Button>
              </Link>
              <Link href="/visa-application">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 bg-transparent font-poppins font-medium"
                >
                  <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {t("homepage.hero.applyVisa")}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Statistics Section */}
          <div className="mt-4 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 md:p-4 border border-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg animate-in fade-in-50 slide-in-from-bottom-2 delay-100">
              <div className="text-xl md:text-3xl font-playfair font-bold text-blue-300 mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" id="customer-counter">1000+</div>
              <div className="text-white font-poppins text-xs md:text-sm">{t("homepage.statistics.happyCustomers")}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 md:p-4 border border-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg animate-in fade-in-50 slide-in-from-bottom-2 delay-200">
              <div className="text-xl md:text-3xl font-playfair font-bold text-purple-300 mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" id="flights-counter">500+</div>
              <div className="text-white font-poppins text-xs md:text-sm">{t("homepage.statistics.successfulFlights")}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 md:p-4 border border-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg animate-in fade-in-50 slide-in-from-bottom-2 delay-300">
              <div className="text-xl md:text-3xl font-playfair font-bold text-pink-300 mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" id="destinations-counter">15+</div>
              <div className="text-white font-poppins text-xs md:text-sm">{t("homepage.statistics.destinations")}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 md:p-4 border border-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg animate-in fade-in-50 slide-in-from-bottom-2 delay-500">
              <div className="text-xl md:text-3xl font-playfair font-bold text-cyan-300 mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" id="support-counter">24/7</div>
              <div className="text-white font-poppins text-xs md:text-sm">{t("homepage.statistics.customerSupport")}</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>

        {/* Scroll cue - hidden on mobile */}
        <a href="#services" className="group absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors hidden md:block">
          <span className="block text-xs tracking-widest uppercase mb-1">{t("common.scroll")}</span>
          <span className="block w-5 h-8 rounded-full border border-white/40 relative overflow-hidden">
            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-2 rounded-full bg-white/70 animate-bounce"></span>
          </span>
        </a>
      </section>
      {/* Particle canvas removed */}

      {/* Services Section */}
      <section id="services" className="py-20 px-4 relative">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
          <div className="absolute -top-24 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 blur-3xl"></div>
          <div className="absolute -bottom-24 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg md:text-5xl font-playfair font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t("homepage.services.title")}
            </h2>
            <p className="body-lg font-poppins text-gray-300 max-w-2xl mx-auto">
              {t("homepage.services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Hotel, title: t("homepage.services.hotelBooking.title"), desc: t("homepage.services.hotelBooking.description") },
              { icon: Plane, title: t("homepage.services.roundTripTickets.title"), desc: t("homepage.services.roundTripTickets.description") },
              { icon: Ticket, title: t("homepage.services.oneWayTickets.title"), desc: t("homepage.services.oneWayTickets.description") },
              { icon: Shield, title: t("homepage.services.medicalSlip.title"), desc: t("homepage.services.medicalSlip.description") },
              { icon: Globe, title: t("homepage.services.touristVisa.title"), desc: t("homepage.services.touristVisa.description") },
              { icon: FileText, title: t("homepage.services.businessVisa.title"), desc: t("homepage.services.businessVisa.description") },
              { icon: Package, title: t("homepage.services.cargoServices.title"), desc: t("homepage.services.cargoServices.description") },
              { icon: Clock, title: t("homepage.services.support24_7.title"), desc: t("homepage.services.support24_7.description") },
            ].map((service, index) => (
              <Card
                key={index}
                className="relative overflow-hidden bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl group animate-in fade-in-50 h-64"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* glow */}
                <div className="pointer-events-none absolute -inset-x-10 -top-10 h-24 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-0 h-full">
                  {/* Top-right Badge */}
                  {(() => {
                    const badges: Record<string, { label: string; cls: string }> = {
                      "Business Visa": { label: "Best for Business", cls: "bg-amber-500/20 text-amber-200 border-amber-400/30" },
                      "Round Trip Tickets": { label: "Popular", cls: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" },
                      "Tourist Visa": { label: "New", cls: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30" },
                    }
                    const b = badges[service.title]
                    return b ? (
                      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${b.cls}`}>{b.label}</span>
                    ) : null
                  })()}

                  {/* Flip card container */}
                  <div className="relative h-full">
                    <div className="h-full [perspective:1000px]">
                      <div className="relative h-full [transform-style:preserve-3d] transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateY(180deg)] md:cursor-pointer"
                        onClick={(e) => {
                          // Mobile tap-to-reveal: toggle a data attribute to apply rotate
                          const card = (e.currentTarget as HTMLElement)
                          if (window.matchMedia('(hover: none)').matches) {
                            const rotated = card.getAttribute('data-rotated') === 'true'
                            card.setAttribute('data-rotated', (!rotated).toString())
                            card.style.transform = rotated ? '' : 'rotateY(180deg)'
                          }
                        }}
                      >
                        {/* Front */}
                        <div className="p-6 text-center absolute inset-0 [backface-visibility:hidden]">
                          <div className="mx-auto mb-4 size-16 rounded-2xl grid place-items-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/15 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                            <service.icon className="h-8 w-8 text-blue-200 group-hover:text-purple-200 transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(59,130,246,0.25)]" />
                          </div>
                          <h3 className="text-white font-playfair font-semibold text-[20px] md:text-[22px] tracking-tight mb-1 leading-snug">{service.title}</h3>
                          <p className="text-white/85 font-poppins text-[13px] leading-relaxed">{service.desc}</p>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 p-6 text-left [transform:rotateY(180deg)] [backface-visibility:hidden] bg-gradient-to-br from-white/10 via-white/5 to-transparent border-t border-white/10 overflow-hidden">
                          {/* decorative glow */}
                          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
                          <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />

                          <h4 className="bg-gradient-to-r from-fuchsia-300 to-purple-300 bg-clip-text text-transparent font-poppins font-semibold text-[13px] tracking-wide mb-2 uppercase"></h4>
                          <p className="text-white/90 text-[13px] leading-relaxed font-poppins">
                            {(() => {
                              const details: Record<string, string> = {
                                "Hotel Booking": "Handpicked 4–5★ stays, flexible cancellation, and concierge recommendations.",
                                "Round Trip Tickets": "Optimized fares with smart layovers and free rebooking assistance.",
                                "One Way Tickets": "Best-value one-way routes, baggage advisory, and visa guidance.",
                                "Medical Slip": "Help with airline medical forms and travel-ready documentation.",
                                "Tourist Visa": "End-to-end application help, checklist, and appointment scheduling.",
                                "Business Visa": "Priority handling, invitation letters, and multi-entry options.",
                                "Cargo Services": "Door-to-door, consolidation, and real-time tracking.",
                                "24/7 Support": "Round-the-clock help via phone, WhatsApp, and Telegram.",
                              }
                              return details[service.title]
                            })()}
                          </p>

                          {/* feature ticks */}
                          <ul className="mt-3 space-y-1.5">
                            {(["Fast processing", "Expert guidance", "Transparent pricing"].map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-white/90 text-[12px] font-poppins">
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-400/40">
                                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-emerald-200" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                </span>
                                <span>{item}</span>
                              </li>
                            )))}
                          </ul>

                          <div className="mt-4">
                            <Link
                              href={service.title.includes('Visa') ? '/visa-application' : service.title.includes('Ticket') || service.title.includes('Flight') ? '/book-ticket' : '/services'}
                              className="inline-block group"
                            >
                              <Button className="relative overflow-hidden bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-blue-500 text-white h-9 px-4 text-xs rounded-full shadow-[0_8px_30px_rgb(99,102,241,0.35)] ring-1 ring-white/20">
                                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10" />
                                <span className="relative">Proceed</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400 to-red-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="heading-lg md:text-5xl font-playfair font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {t("homepage.destinations.title")}
            </h2>
            <p className="body-lg font-poppins text-gray-300 max-w-3xl mx-auto">
              {t("homepage.destinations.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {[
              {
                name: "Dubai, UAE",
                description: "Luxury shopping, ultramodern architecture, and a lively nightlife scene",
                highlights: ["Burj Khalifa", "Palm Jumeirah", "Desert Safari"],
                images: ["/destinations/UAE 1.jpg", "/destinations/UAE 2.jpg", "/destinations/UAE 3.jpg", "/destinations/UAE 4.jpg"],
                image: "/destinations/UAE 1.jpg",
                gradient: "from-amber-400 to-orange-500",
                isImageCarousel: true
              },
              {
                name: "Saudi Arabia",
                description: "Rich cultural heritage, modern cities, and spiritual significance",
                highlights: ["Mecca", "Riyadh", "Jeddah"],
                images: ["/destinations/saudi 1.jpg", "/destinations/saudi 2.jpg", "/destinations/saudi 3.jpeg", "/destinations/saudi 4.jpg"],
                image: "/destinations/saudi 1.jpg",
                gradient: "from-green-400 to-emerald-500",
                isImageCarousel: true
              },
              {
                name: "Qatar",
                description: "Futuristic architecture, cultural museums, and desert adventures",
                highlights: ["Doha", "Museum of Islamic Art", "Desert Tours"],
                images: ["/destinations/qatar 1.jpeg", "/destinations/qatar 2.jpg", "/destinations/qatar 3.jpeg", "/destinations/qatar 4.jpg"],
                image: "/destinations/qatar 1.jpeg",
                gradient: "from-purple-400 to-indigo-500",
                isImageCarousel: true
              },
              {
                name: "Kuwait",
                description: "Modern cityscape, rich history, and Persian Gulf charm",
                highlights: ["Kuwait City", "Kuwait Towers", "Marina"],
                images: ["/destinations/kuwait 1.jpg", "/destinations/kuwait 2.jpg", "/destinations/kuwait 3.jpg", "/destinations/kuwait 4.jpg"],
                image: "/destinations/kuwait 1.jpg",
                gradient: "from-blue-400 to-cyan-500",
                isImageCarousel: true
              },
              {
                name: "United States",
                description: "Diverse landscapes, iconic cities, and endless possibilities",
                highlights: ["New York", "Los Angeles", "Las Vegas"],
                images: ["/destinations/usa 1.jpg", "/destinations/usa 2.jpeg", "/destinations/usa 3.jpg", "/destinations/usa 4.jpg"],
                image: "/destinations/usa 1.jpg",
                gradient: "from-red-400 to-pink-500",
                isImageCarousel: true
              },
              {
                name: "Canada",
                description: "Natural beauty, friendly cities, and outdoor adventures",
                highlights: ["Toronto", "Vancouver", "Niagara Falls"],
                images: ["/destinations/canada 1.jpg", "/destinations/canada 2.jpeg", "/destinations/canada 3.webp", "/destinations/canada 4.jpg"],
                image: "/destinations/canada 1.jpg",
                gradient: "from-red-500 to-red-600",
                isImageCarousel: true
              },
              {
                name: "Thailand",
                description: "Tropical beaches, ornate temples, and vibrant street life",
                highlights: ["Bangkok", "Phuket", "Chiang Mai"],
                images: ["/destinations/thailand 1.jpeg", "/destinations/thailand 2.jpg", "/destinations/thailand 3.jpg", "/destinations/thailand 4.jpg"],
                image: "/destinations/thailand 1.jpeg",
                gradient: "from-blue-500 to-indigo-600",
                isImageCarousel: true
              },
              {
                name: "Kenya",
                description: "Wildlife safaris, stunning landscapes, and rich culture",
                highlights: ["Nairobi", "Masai Mara", "Mombasa"],
                images: ["/destinations/kenya 1.jpg", "/destinations/kenya 2.jpg", "/destinations/kenya 3.jpg", "/destinations/kenya 4.jpg"],
                image: "/destinations/kenya 1.jpg",
                gradient: "from-green-500 to-emerald-600",
                isImageCarousel: true
              },
              {
                name: "Uganda",
                description: "Gorilla trekking, diverse wildlife, and natural wonders",
                highlights: ["Kampala", "Bwindi Forest", "Lake Victoria"],
                images: ["/destinations/uganda 1.jpg", "/destinations/uganda 2.jpg", "/destinations/uganda 3.jpg", "/destinations/uganda 4.jpg"],
                image: "/destinations/uganda 1.jpg",
                gradient: "from-yellow-500 to-orange-600",
                isImageCarousel: true
              }
            ].map((destination, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden bg-white/5 backdrop-blur-lg border border-white/20 hover:border-white/40 active:border-white/40 transition-all duration-700 transform hover:shadow-2xl active:shadow-2xl cursor-pointer ${
                  destination.isImageCarousel 
                    ? 'hover:scale-150 hover:z-20 md:hover:scale-150 lg:hover:scale-175 active:scale-125 md:active:scale-150 lg:active:scale-175' 
                    : 'hover:scale-105 active:scale-110'
                }`}
                onMouseEnter={() => destination.isImageCarousel && setHoveredDestination(destination.name)}
                onMouseLeave={() => destination.isImageCarousel && setHoveredDestination(null)}
                onTouchStart={() => destination.isImageCarousel && setHoveredDestination(destination.name)}
                onTouchEnd={() => destination.isImageCarousel && setHoveredDestination(null)}
              >
                {/* Background Image with Overlay */}
                <div className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${
                  destination.isImageCarousel 
                    ? 'opacity-30 group-hover:opacity-80' 
                    : 'opacity-20 group-hover:opacity-30'
                }`}>
                  {destination.isImageCarousel && destination.images ? (
                    // Image Carousel for Saudi Arabia
                    <div className="relative w-full h-full">
                      {destination.images.map((image, imgIdx) => (
                        <div
                          key={imgIdx}
                          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            (hoveredDestination && ['Saudi Arabia', 'Dubai, UAE', 'Qatar', 'Kuwait', 'United States', 'Canada', 'Thailand', 'Kenya', 'Uganda'].includes(hoveredDestination) && imgIdx === imageIndex) || 
                            (!hoveredDestination || !['Saudi Arabia', 'Dubai, UAE', 'Qatar', 'Kuwait', 'United States', 'Canada', 'Thailand', 'Kenya', 'Uganda'].includes(hoveredDestination) && imgIdx === 0) ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${destination.name} - Image ${imgIdx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Regular single image for other destinations
                    <Image
                      src={destination.image || "/modern-airplane-sunset-clouds.jpg"}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${destination.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                <CardContent className="relative z-10 p-3 sm:p-6 h-full flex flex-col justify-between">
                  {/* Destination Header */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-white font-bold text-base sm:text-xl group-hover:text-sm sm:group-hover:text-base transition-all duration-300 ${
                        destination.isImageCarousel 
                          ? 'font-extrabold tracking-wide text-shadow-lg' 
                          : ''
                      }`}>
                        {destination.name}
                      </h3>
                      {destination.isImageCarousel && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 group-hover:text-xs transition-all duration-300">
                      {destination.description}
                    </p>

                  </div>
                  
                  {/* Highlights */}
                  <div className="mb-2 sm:mb-4">
                    <h4 className="text-white/80 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-wider group-hover:text-xs transition-all duration-300">
                      Highlights
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {destination.highlights.map((highlight, idx) => (
                                                                          <span
                          key={idx}
                          className="px-1 sm:px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:text-xs group-hover:px-0.5 sm:group-hover:px-1"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Button
                      className={`w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 hover:border-white/50 transition-all duration-300 transform text-sm sm:text-base py-1.5 sm:py-3 ${
                        destination.isImageCarousel 
                          ? 'group-hover:scale-25 group-hover:opacity-30 group-hover:text-xs group-hover:py-1 group-active:scale-50 group-active:opacity-40' 
                          : 'group-hover:scale-105 group-hover:text-xs group-hover:py-1 sm:group-hover:py-2 group-active:scale-110'
                      }`}
                    >
                      Explore {destination.name.split(',')[0]}
                    </Button>
                  </div>
                </CardContent>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
              </Card>
            ))}
          </div>
          
          {/* View All Destinations CTA */}
          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              {t("homepage.destinations.viewAll")}
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Airlines Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/abstract-geometric-shapes.png')] bg-repeat bg-center"></div>

        {/* Glow circles */}
        <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-500/30 mix-blend-overlay animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-500/30 mix-blend-overlay animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-500/20 mix-blend-overlay animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("homepage.airlines.title")}
            </h2>
            <p className="text-gray-300 text-base max-w-2xl mx-auto">
              {t("homepage.airlines.subtitle")}
            </p>
          </div>

          {/* Flowing Airlines Carousel */}
          <div className="relative overflow-hidden">
            {/* First row - moving left */}
            <div className="flex animate-scroll-left">
              {logos.map((logo, i) => (
                <div
                  key={`left-${logo.name}-${i}`}
                  className="relative group p-4 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.05] mx-2 min-w-[140px] flex-shrink-0"
                >
                  {/* Glow hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                  {/* Logo with white background for contrast */}
                  <div className="flex items-center justify-center mb-2 bg-white/90 rounded-md p-2 h-16 overflow-hidden">
                    <div className="relative transition-all duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        width={logo.width / 2}
                        height={logo.height / 2}
                        className="object-contain transition-all duration-300 group-hover:scale-105 max-h-12"
                      />
                    </div>
                  </div>

                  {/* Airline name */}
                  <h3 className="text-white font-medium text-sm text-center group-hover:text-purple-300 transition-colors duration-200 truncate">
                    {logo.name}
                  </h3>
                </div>
              ))}
              {/* Duplicate logos for seamless loop */}
            {logos.map((logo, i) => (
              <div
                  key={`left-duplicate-${logo.name}-${i}`}
                  className="relative group p-4 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.05] mx-2 min-w-[140px] flex-shrink-0"
                >
                  {/* Glow hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                  {/* Logo with white background for contrast */}
                  <div className="flex items-center justify-center mb-2 bg-white/90 rounded-md p-2 h-16 overflow-hidden">
                    <div className="relative transition-all duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        width={logo.width / 2}
                        height={logo.height / 2}
                        className="object-contain transition-all duration-300 group-hover:scale-105 max-h-12"
                      />
                    </div>
                  </div>

                  {/* Airline name */}
                  <h3 className="text-white font-medium text-sm text-center group-hover:text-purple-300 transition-colors duration-200 truncate">
                    {logo.name}
                  </h3>
                </div>
              ))}
            </div>

            {/* Second row - moving right */}
            <div className="flex animate-scroll-right mt-6">
              {logos.slice().reverse().map((logo, i) => (
                <div
                  key={`right-${logo.name}-${i}`}
                  className="relative group p-4 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.05] mx-2 min-w-[140px] flex-shrink-0"
              >
                {/* Glow hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                {/* Logo with white background for contrast */}
                <div className="flex items-center justify-center mb-2 bg-white/90 rounded-md p-2 h-16 overflow-hidden">
                    <div className="relative transition-all duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        width={logo.width / 2}
                        height={logo.height / 2}
                        className="object-contain transition-all duration-300 group-hover:scale-105 max-h-12"
                      />
                    </div>
                  </div>

                  {/* Airline name */}
                  <h3 className="text-white font-medium text-sm text-center group-hover:text-purple-300 transition-colors duration-200 truncate">
                    {logo.name}
                  </h3>
                </div>
              ))}
              {/* Duplicate logos for seamless loop */}
              {logos.slice().reverse().map((logo, i) => (
                <div
                  key={`right-duplicate-${logo.name}-${i}`}
                  className="relative group p-4 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.05] mx-2 min-w-[140px] flex-shrink-0"
                >
                  {/* Glow hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                  {/* Logo with white background for contrast */}
                  <div className="flex items-center justify-center mb-2 bg-white/90 rounded-md p-2 h-16 overflow-hidden">
                    <div className="relative transition-all duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width / 2}
                      height={logo.height / 2}
                      className="object-contain transition-all duration-300 group-hover:scale-105 max-h-12"
                    />
                  </div>
                </div>

                {/* Airline name */}
                <h3 className="text-white font-medium text-sm text-center group-hover:text-purple-300 transition-colors duration-200 truncate">
                  {logo.name}
                </h3>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("homepage.cta.title")}</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              {t("homepage.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {t("homepage.cta.learnMore")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  {t("homepage.cta.contactUs")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Language Test Component - Remove after testing */}
      <LanguageTest />
    </div>
  );
}
