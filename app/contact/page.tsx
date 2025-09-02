"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export default function ContactPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const saveKey = 'contact_form_v1'
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(saveKey)
      if (raw) {
        const d = JSON.parse(raw)
        setName(d.name ?? "")
        setEmail(d.email ?? "")
        setPhone(d.phone ?? "")
        setSubject(d.subject ?? "")
        setMessage(d.message ?? "")
      }
    } catch {}
  }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    const d = { name, email, phone, subject, message }
    try { localStorage.setItem(saveKey, JSON.stringify(d)) } catch {}
  }, [name, email, phone, subject, message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = t("contact.validation.fullNameRequired")
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t("contact.validation.emailRequired")
    if (!subject.trim()) errs.subject = t("contact.validation.subjectRequired")
    if (!message.trim() || message.trim().length < 10) errs.message = t("contact.validation.messageRequired")
    if (Object.keys(errs).length > 0) { setErrors(errs); setIsLoading(false); return }
    setErrors({})

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{t("contact.success.title")}</h2>
            <p className="text-gray-300 mb-6">{t("contact.success.message")}</p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {t("contact.success.sendAnother")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8 md:pt-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("contact.hero.title")}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t("contact.hero.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                  {t("contact.contactInfo.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">{t("contact.contactInfo.phone.title")}</h3>
                    <div className="space-y-2">
                      <a href="tel:+251962765453" className="block text-gray-300 hover:text-blue-400 transition-colors">
                        {t("contact.contactInfo.phone.phone1")}
                      </a>
                      <a href="tel:+251722765453" className="block text-gray-300 hover:text-blue-400 transition-colors">
                        {t("contact.contactInfo.phone.phone2")}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">{t("contact.contactInfo.email.title")}</h3>
                    <a
                      href="mailto:info@skyethio.com"
                      className="text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      {t("contact.contactInfo.email.address")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-pink-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">{t("contact.contactInfo.location.title")}</h3>
                    <p className="text-gray-300">
                      {t("contact.contactInfo.location.address")}
                      <br />
                      {t("contact.contactInfo.location.country")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">{t("contact.contactInfo.hours.title")}</h3>
                    <div className="text-gray-300 space-y-1">
                      <p>{t("contact.contactInfo.hours.weekdays")}</p>
                      <p>{t("contact.contactInfo.hours.saturday")}</p>
                      <p>{t("contact.contactInfo.hours.sunday")}</p>
                      <p className="text-green-400 font-semibold">{t("contact.contactInfo.hours.emergency")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motto Card */}
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border-white/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">{t("contact.motto.title")}</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  "{t("contact.motto.text")}"
                </p>
                <p className="text-gray-300 mt-4">{t("contact.motto.description")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Send className="h-6 w-6 text-blue-400" />
                {t("contact.form.title")}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">{t("contact.form.fullName")}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder={t("contact.form.fullNamePlaceholder")} aria-invalid={!!errors.name} />
                  {errors.name && <p className="text-red-300 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">{t("contact.form.email")}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder={t("contact.form.emailPlaceholder")} aria-invalid={!!errors.email} />
                  {errors.email && <p className="text-red-300 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">{t("contact.form.phone")}</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder={t("contact.form.phonePlaceholder")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white">{t("contact.form.subject")}</Label>
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder={t("contact.form.subjectPlaceholder")} aria-invalid={!!errors.subject} />
                  {errors.subject && <p className="text-red-300 text-sm">{errors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">{t("contact.form.message")}</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 min-h-[120px]" placeholder={t("contact.form.messagePlaceholder")} aria-invalid={!!errors.message} />
                  <div className="flex justify-between text-xs text-white/60"><span>{message.length}/1000</span>{errors.message && <span className="text-red-300">{errors.message}</span>}</div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t("contact.form.submit.processing")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      {t("contact.form.submit.button")}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <MapPin className="h-6 w-6 text-blue-400" />
                {t("contact.map.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">{t("contact.map.companyName")}</h3>
                  <p className="text-gray-300">{t("contact.map.address")}</p>
                  <p className="text-sm text-gray-400 mt-2">{t("contact.map.mapNote")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
