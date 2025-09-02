'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Globe, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/hooks/useTranslation"

export default function AboutPage() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="pointer-events-none absolute -inset-20 blur-3xl opacity-30">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 rounded-full"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-br from-fuchsia-500/30 to-purple-600/30 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("about.hero.title")}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 overflow-hidden">
              <div className="pointer-events-none absolute -inset-x-8 -top-6 h-16 skew-y-6 bg-gradient-to-r from-white/10 to-transparent" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t("about.story.title")}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {t("about.story.paragraph1")}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t("about.story.paragraph2")}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
              <Image
                src="/placeholder-b920m.png"
                alt="SkyEthio Office"
                width={600}
                height={400}
                className="relative z-10 rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("about.values.title")}
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t("about.values.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: t("about.values.excellence.title"),
                description: t("about.values.excellence.description"),
              },
              {
                icon: Users,
                title: t("about.values.customerFirst.title"),
                description: t("about.values.customerFirst.description"),
              },
              {
                icon: Award,
                title: t("about.values.reliability.title"),
                description: t("about.values.reliability.description"),
              },
              {
                icon: Globe,
                title: t("about.values.globalReach.title"),
                description: t("about.values.globalReach.description"),
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
              >
                <CardContent className="p-8 text-center">
                  <value.icon className="h-16 w-16 text-blue-400 mx-auto mb-6 group-hover:text-purple-400 transition-colors duration-300" />
                  <h3 className="text-white font-bold text-xl mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/25 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-12 rounded-xl grid place-items-center bg-cyan-500/25 border border-white/20">
                    <Target className="h-6 w-6 text-cyan-200" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {t("about.mission.title")}
                    </h3>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 mb-4">
                  <p className="text-white/90 text-lg leading-relaxed">
                    {t("about.mission.description")}
                  </p>
                </div>
                <ul className="space-y-2">
                  {[
                    t("about.mission.points.point1"),
                    t("about.mission.points.point2"),
                    t("about.mission.points.point3")
                  ].map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90">
                      <CheckCircle2 className="h-4 w-4 text-cyan-200 mt-1" />
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/25 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-12 rounded-xl grid place-items-center bg-pink-500/25 border border-white/20">
                    <Globe className="h-6 w-6 text-pink-200" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {t("about.vision.title")}
                    </h3>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 mb-4">
                  <p className="text-white/90 text-lg leading-relaxed">
                    To lead Ethiopia’s travel and cargo industry through innovation, reliability, and unforgettable
                    customer experiences.
                  </p>
                </div>
                <ul className="space-y-2">
                  {[
                    t("about.vision.points.point1"),
                    t("about.vision.points.point2"),
                    t("about.vision.points.point3")
                  ].map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90">
                      <CheckCircle2 className="h-4 w-4 text-pink-200 mt-1" />
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t("about.team.title")}
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
            {t("about.team.subtitle")}
          </p>

          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-300">{t("about.team.stats.happyCustomers")}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">{t("about.team.stats.destinations")}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-400 mb-2">24/7</div>
                <div className="text-gray-300">{t("about.team.stats.customerSupport")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("about.motto.title")}</h2>
            <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              "{t("about.motto.text")}"
            </p>
            <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto">
              {t("about.motto.description")}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
