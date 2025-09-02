import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hotel, Plane, Ticket, FileText, Globe, Package, Shield, Clock, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Hotel,
      title: "Hotel Booking",
      description: "Luxury accommodations worldwide with exclusive rates and premium locations",
      features: ["5-star hotels", "Best price guarantee", "24/7 concierge", "Flexible cancellation"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Plane,
      title: "Round Trip Tickets",
      description: "Seamless round-trip experiences with flexible scheduling and premium airlines",
      features: ["Flexible dates", "Premium airlines", "Seat selection", "Meal preferences"],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Ticket,
      title: "One Way Tickets",
      description: "Flexible one-way travel options for spontaneous adventures and business trips",
      features: ["Last-minute booking", "Multiple airlines", "Competitive prices", "Easy rebooking"],
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: Shield,
      title: "Medical Slip",
      description: "Comprehensive health documentation support for international travel",
      features: ["Health certificates", "Vaccination records", "Medical clearance", "Expert guidance"],
      gradient: "from-red-500 to-orange-500",
    },
    {
      icon: Globe,
      title: "Tourist Visa",
      description: "Explore the world with ease through our comprehensive visa assistance",
      features: ["Document preparation", "Application tracking", "Expert consultation", "Fast processing"],
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: FileText,
      title: "Business Visa",
      description: "Professional travel solutions for business expansion and corporate needs",
      features: ["Corporate packages", "Priority processing", "Multiple entry", "Dedicated support"],
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Package,
      title: "Cargo Services",
      description: "Reliable freight solutions for personal and commercial shipping needs",
      features: ["Door-to-door delivery", "Real-time tracking", "Secure packaging", "Insurance coverage"],
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your travel and cargo inquiries",
      features: ["Live chat support", "Emergency assistance", "Multi-language", "Expert advisors"],
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
            Premium Travel Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover our comprehensive range of travel and cargo services designed to make your journey seamless and
            memorable
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-ticket">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Book Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 bg-transparent"
              >
                Get Quote
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
                      "Business Visa": { label: "Best for Business", cls: "bg-amber-500/20 text-amber-200 border-amber-400/30" },
                      "Round Trip Tickets": { label: "Popular", cls: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" },
                      "Tourist Visa": { label: "New", cls: "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30" },
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
                          Proceed
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
              Why Choose SkyEthio?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the difference with our premium services and dedicated support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group text-center">
              <CardContent className="p-8">
                <Star className="h-16 w-16 text-yellow-400 mx-auto mb-6 group-hover:text-yellow-300 transition-colors duration-300" />
                <h3 className="text-white font-bold text-xl mb-4">Premium Quality</h3>
                <p className="text-gray-300 leading-relaxed">
                  We partner with only the best airlines and hotels to ensure your experience exceeds expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group text-center">
              <CardContent className="p-8">
                <Shield className="h-16 w-16 text-green-400 mx-auto mb-6 group-hover:text-green-300 transition-colors duration-300" />
                <h3 className="text-white font-bold text-xl mb-4">Trusted & Secure</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your safety and security are our top priorities. All transactions are protected and encrypted.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group text-center">
              <CardContent className="p-8">
                <Clock className="h-16 w-16 text-blue-400 mx-auto mb-6 group-hover:text-blue-300 transition-colors duration-300" />
                <h3 className="text-white font-bold text-xl mb-4">24/7 Support</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our dedicated support team is available around the clock to assist with any questions or concerns.
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Premium Travel?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Let us handle all your travel needs while you focus on what matters most - your journey and destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-ticket">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  Contact Expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
