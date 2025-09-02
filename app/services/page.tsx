'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hotel, Plane, Ticket, FileText, Globe, Package, Shield, Clock, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"

export default function ServicesPage() {
  const { t } = useTranslation()
  
  const services = [
    {
      icon: Hotel,
      title: t("services.serviceItems.hotelBooking.title"),
      description: t("services.serviceItems.hotelBooking.description"),
      features: [
        t("services.serviceItems.hotelBooking.features.feature1"),
        t("services.serviceItems.hotelBooking.features.feature2"),
        t("services.serviceItems.hotelBooking.features.feature3"),
        t("services.serviceItems.hotelBooking.features.feature4")
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Plane,
      title: t("services.serviceItems.roundTripTickets.title"),
      description: t("services.serviceItems.roundTripTickets.description"),
      features: [
        t("services.serviceItems.roundTripTickets.features.feature1"),
        t("services.serviceItems.roundTripTickets.features.feature2"),
        t("services.serviceItems.roundTripTickets.features.feature3"),
        t("services.serviceItems.roundTripTickets.features.feature4")
      ],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Ticket,
      title: t("services.serviceItems.oneWayTickets.title"),
      description: t("services.serviceItems.oneWayTickets.description"),
      features: [
        t("services.serviceItems.oneWayTickets.features.feature1"),
        t("services.serviceItems.oneWayTickets.features.feature2"),
        t("services.serviceItems.oneWayTickets.features.feature3"),
        t("services.serviceItems.oneWayTickets.features.feature4")
      ],
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: Shield,
      title: t("services.serviceItems.medicalSlip.title"),
      description: t("services.serviceItems.medicalSlip.description"),
      features: [
        t("services.serviceItems.medicalSlip.features.feature1"),
        t("services.serviceItems.medicalSlip.features.feature2"),
        t("services.serviceItems.medicalSlip.features.feature3"),
        t("services.serviceItems.medicalSlip.features.feature4")
      ],
      gradient: "from-red-500 to-orange-500",
    },
    {
      icon: Globe,
      title: t("services.serviceItems.touristVisa.title"),
      description: t("services.serviceItems.touristVisa.description"),
      features: [
        t("services.serviceItems.touristVisa.features.feature1"),
        t("services.serviceItems.touristVisa.features.feature2"),
        t("services.serviceItems.touristVisa.features.feature3"),
        t("services.serviceItems.touristVisa.features.feature4")
      ],
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: FileText,
      title: t("services.serviceItems.businessVisa.title"),
      description: t("services.serviceItems.businessVisa.description"),
      features: [
        t("services.serviceItems.businessVisa.features.feature1"),
        t("services.serviceItems.businessVisa.features.feature2"),
        t("services.serviceItems.businessVisa.features.feature3"),
        t("services.serviceItems.businessVisa.features.feature4")
      ],
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Package,
      title: t("services.serviceItems.cargoServices.title"),
      description: t("services.serviceItems.cargoServices.description"),
      features: [
        t("services.serviceItems.cargoServices.features.feature1"),
        t("services.serviceItems.cargoServices.features.feature2"),
        t("services.serviceItems.cargoServices.features.feature3"),
        t("services.serviceItems.cargoServices.features.feature4")
      ],
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: Clock,
      title: t("services.serviceItems.support24_7.title"),
      description: t("services.serviceItems.support24_7.description"),
      features: [
        t("services.serviceItems.support24_7.features.feature1"),
        t("services.serviceItems.support24_7.features.feature2"),
        t("services.serviceItems.support24_7.features.feature3"),
        t("services.serviceItems.support24_7.features.feature4")
      ],
      gradient: "from-pink-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="pointer-events-none absolute -inset-20 blur-3xl opacity-30">
          <div className="absolute top-12 left-1/5 w-72 h-72 bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 rounded-full" />
          <div className="absolute bottom-12 right-1/5 w-80 h-80 bg-gradient-to-br from-fuchsia-500/30 to-purple-600/30 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("services.hero.title")}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            {t("services.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-ticket">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {t("services.hero.bookNow")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 bg-transparent"
              >
                {t("services.hero.getQuote")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="relative bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl group overflow-hidden animate-in fade-in-50"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                <CardHeader className="relative z-10">
                  {/* Badge */}
                  {(() => {
                    const badges: Record<string, { label: string; cls: string }> = {
                      [t("services.serviceItems.businessVisa.title")]: { label: t("services.badges.bestForBusiness"), cls: "bg-amber-500/20 text-amber-200 border-amber-400/30" },
                      [t("services.serviceItems.roundTripTickets.title")]: { label: t("services.badges.popular"), cls: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" },
                      [t("services.serviceItems.touristVisa.title")]: { label: t("services.badges.new"), cls: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30" },
                    }
                    const b = badges[service.title]
                    return b ? (
                      <span className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${b.cls}`}>{b.label}</span>
                    ) : null
                  })()}
                  <div className="flex items-center space-x-4 mb-2">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg border border-white/10`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-[22px] md:text-2xl font-bold text-white tracking-tight">
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="text-white/90 text-[15px] mb-6 leading-relaxed">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/85">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {(() => {
                    const href = service.title.includes('Visa')
                      ? '/visa-application'
                      : (service.title.includes('Ticket') || service.title.includes('Flight'))
                        ? '/book-ticket'
                        : '/contact'
                    return (
                      <Link href={href} className="block">
                        <Button
                          className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-white font-semibold`}
                        >
                          {t("services.proceed")}
                        </Button>
                      </Link>
                    )
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("services.whyChooseUs.title")}
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {t("services.whyChooseUs.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group text-center">
              <CardContent className="p-8">
                <Star className="h-16 w-16 text-yellow-400 mx-auto mb-6 group-hover:text-yellow-300 transition-colors duration-300" />
                <h3 className="text-white font-bold text-xl mb-4">{t("services.whyChooseUs.premiumQuality.title")}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {t("services.whyChooseUs.premiumQuality.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group text-center">
              <CardContent className="p-8">
                <Shield className="h-16 w-16 text-green-400 mx-auto mb-6 group-hover:text-green-300 transition-colors duration-300" />
                <h3 className="text-white font-bold text-xl mb-4">{t("services.whyChooseUs.trustedSecure.title")}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {t("services.whyChooseUs.trustedSecure.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group text-center">
              <CardContent className="p-8">
                <Clock className="h-16 w-16 text-blue-400 mx-auto mb-6 group-hover:text-blue-300 transition-colors duration-300" />
                <h3 className="text-white font-bold text-xl mb-4">{t("services.whyChooseUs.support24_7.title")}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {t("services.whyChooseUs.support24_7.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("services.cta.title")}</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              {t("services.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-ticket">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {t("services.cta.startJourney")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  {t("services.cta.contactExpert")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
