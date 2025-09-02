"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, User, CreditCard, Globe, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function VisaApplicationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Form state
  const [visaType, setVisaType] = useState<string>("")
  const [duration, setDuration] = useState("")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState<string>("")
  const [birthYear, setBirthYear] = useState<string>("")
  const [passportNumber, setPassportNumber] = useState("")
  const [notes, setNotes] = useState("")

  const [bankFile, setBankFile] = useState<File | null>(null)
  const [bankUrl, setBankUrl] = useState<string | null>(null)
  const [bankIsPdf, setBankIsPdf] = useState(false)

  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [passportUrl, setPassportUrl] = useState<string | null>(null)
  const [passportIsPdf, setPassportIsPdf] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const saveKey = 'visa_application_form_v1'

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(saveKey)
      if (raw) {
        const d = JSON.parse(raw)
        setVisaType(d.visaType ?? "")
        setDuration(d.duration ?? "")
        setEmail(d.email ?? "")
        setFullName(d.fullName ?? "")
        setAge(d.age ?? "")
        setBirthYear(d.birthYear ?? "")
        setPassportNumber(d.passportNumber ?? "")
        setNotes(d.notes ?? "")
      }
    } catch {}
  }, [])

  // Save to localStorage (excluding files)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const d = { visaType, duration, email, fullName, age, birthYear, passportNumber, notes }
    try { localStorage.setItem(saveKey, JSON.stringify(d)) } catch {}
  }, [visaType, duration, email, fullName, age, birthYear, passportNumber, notes])

  // File previews
  useEffect(() => {
    if (!bankFile) {
      if (bankUrl) URL.revokeObjectURL(bankUrl)
      setBankUrl(null); setBankIsPdf(false)
      return
    }
    const url = URL.createObjectURL(bankFile)
    setBankUrl(url)
    setBankIsPdf(/pdf$/i.test(bankFile.type) || /\.pdf$/i.test(bankFile.name))
    return () => URL.revokeObjectURL(url)
  }, [bankFile])

  useEffect(() => {
    if (!passportFile) {
      if (passportUrl) URL.revokeObjectURL(passportUrl)
      setPassportUrl(null); setPassportIsPdf(false)
      return
    }
    const url = URL.createObjectURL(passportFile)
    setPassportUrl(url)
    setPassportIsPdf(/pdf$/i.test(passportFile.type) || /\.pdf$/i.test(passportFile.name))
    return () => URL.revokeObjectURL(url)
  }, [passportFile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const errs: Record<string, string> = {}
    if (!visaType) errs.visaType = 'Visa type is required.'
    if (!duration.trim()) errs.duration = 'Duration is required.'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email is required.'
    if (!fullName.trim()) errs.fullName = 'Full name is required.'
    if (!age || Number(age) < 1) errs.age = 'Valid age is required.'
    if (!birthYear || Number(birthYear) < 1900) errs.birthYear = 'Valid birth year is required.'
    if (!passportNumber.trim()) errs.passportNumber = 'Passport number is required.'
    if (!bankFile) errs.bankFile = 'Bank statement is required.'
    if (!passportFile) errs.passportFile = 'Passport copy is required.'
    
    if (Object.keys(errs).length > 0) { 
      setErrors(errs)
      setIsLoading(false)
      return 
    }
    setErrors({})

    try {
      let passportFileUrl = null;
      let bankStatementUrl = null;

      // Upload passport file to Supabase Storage
      if (passportFile) {
        const passportFileName = `passports/${Date.now()}_${passportFile.name}`;
        const { data: passportData, error: passportError } = await supabase.storage
          .from('documents')
          .upload(passportFileName, passportFile);

        if (passportError) {
          console.error('Error uploading passport file:', passportError);
          toast.error('Failed to upload passport file. Please try again.');
          setIsLoading(false);
          return;
        }

        // Get public URL for passport file
        const { data: passportUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(passportFileName);
        
        passportFileUrl = passportUrlData.publicUrl;
      }

      // Upload bank statement file to Supabase Storage
      if (bankFile) {
        const bankFileName = `bank_statements/${Date.now()}_${bankFile.name}`;
        const { data: bankData, error: bankError } = await supabase.storage
          .from('documents')
          .upload(bankFileName, bankFile);

        if (bankError) {
          console.error('Error uploading bank statement file:', bankError);
          toast.error('Failed to upload bank statement file. Please try again.');
          setIsLoading(false);
          return;
        }

        // Get public URL for bank statement file
        const { data: bankUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(bankFileName);
        
        bankStatementUrl = bankUrlData.publicUrl;
      }

      // Save to Supabase database with file URLs
      const { data, error } = await supabase
        .from('visa_applications')
        .insert([
          {
            applicant_name: fullName,
            applicant_email: email,
            visa_type: visaType,
            duration: duration,
            age: parseInt(age),
            birth_year: parseInt(birthYear),
            passport_number: passportNumber,
            additional_notes: notes || null,
            passport_file_url: passportFileUrl,
            bank_statement_url: bankStatementUrl,
            status: 'pending',
            application_date: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error saving visa application:', error)
        toast.error('Failed to submit visa application. Please try again.')
        setIsLoading(false)
        return
      }

      // Clear form data from localStorage
      localStorage.removeItem(saveKey)
      
      toast.success('Visa application submitted successfully!')
      setIsLoading(false)
      setIsSubmitted(true)
      
    } catch (error) {
      console.error('Error submitting visa application:', error)
      toast.error('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
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
            <h2 className="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
            <p className="text-gray-300 mb-6">
              Your visa application has been received. Our team will review your documents and contact you within 2-3
              business days.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Submit Another Application
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
        <div className="text-center mb-12 relative pt-8 md:pt-10">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Visa Application
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Apply for your visa with our expert assistance and streamlined process
          </p>
        </div>

        {/* Form + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl lg:col-span-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-400" />
                Visa Application Form
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Visa Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-400" />
                    Visa Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="visaType" className="text-white">
                        Visa Type *
                      </Label>
                      <Select value={visaType} onValueChange={setVisaType}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select visa type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/20">
                          <SelectItem value="Tourist Visa" className="text-white hover:bg-white/10">Tourist Visa</SelectItem>
                          <SelectItem value="Business Visa" className="text-white hover:bg-white/10">Business Visa</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.visaType && <p className="text-red-300 text-sm">{errors.visaType}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white">
                        Duration of Visa *
                      </Label>
                      <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder="e.g., 30 days, 90 days" aria-invalid={!!errors.duration} />
                      {errors.duration && <p className="text-red-300 text-sm">{errors.duration}</p>}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-400" />
                    Contact Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address *</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder="your.email@example.com" aria-invalid={!!errors.email} />
                    {errors.email && <p className="text-red-300 text-sm">{errors.email}</p>}
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                    Required Documents
                  </h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankStatement" className="text-white">
                        Bank Statement *
                      </Label>
                      <label htmlFor="bankStatement" className="block cursor-pointer border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-colors">
                        <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-white/90 mb-1">Upload your bank statement</p>
                        <p className="text-xs text-white/70">PDF or Image files only</p>
                      </label>
                      <Input id="bankStatement" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setBankFile(e.target.files?.[0] ?? null)} />
                      {errors.bankFile && <p className="text-red-300 text-sm">{errors.bankFile}</p>}
                      {bankUrl && (
                        <div className="mt-2">
                          {bankIsPdf ? (
                            <div className="flex items-center gap-2 rounded-md bg-white/10 p-2">
                              <div className="size-10 rounded bg-white/20 grid place-items-center text-white/80 text-xs">PDF</div>
                              <span className="text-xs truncate">{bankFile?.name}</span>
                            </div>
                          ) : (
                            <img src={bankUrl} alt="Bank preview" className="w-full h-24 object-cover rounded-md bg-white/5" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Passport Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Passport Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white">Full Name (as in passport) *</Label>
                      <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder="Enter full name" aria-invalid={!!errors.fullName} />
                      {errors.fullName && <p className="text-red-300 text-sm">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-white">Age *</Label>
                      <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} min="1" max="120" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder="Enter age" aria-invalid={!!errors.age} />
                      {errors.age && <p className="text-red-300 text-sm">{errors.age}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthYear" className="text-white">Year of Birth *</Label>
                      <Input id="birthYear" type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} min="1900" max={new Date().getFullYear()} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder="YYYY" aria-invalid={!!errors.birthYear} />
                      {errors.birthYear && <p className="text-red-300 text-sm">{errors.birthYear}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passportNumber" className="text-white">Passport Number *</Label>
                      <Input id="passportNumber" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400" placeholder="Enter passport number" aria-invalid={!!errors.passportNumber} />
                      {errors.passportNumber && <p className="text-red-300 text-sm">{errors.passportNumber}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportFile" className="text-white">Passport Copy *</Label>
                    <label htmlFor="passportFile" className="block cursor-pointer border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-colors">
                      <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-white/90 mb-1">Upload passport copy</p>
                      <p className="text-xs text-white/70">PDF or Image files only</p>
                    </label>
                    <Input id="passportFile" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setPassportFile(e.target.files?.[0] ?? null)} />
                    {errors.passportFile && <p className="text-red-300 text-sm">{errors.passportFile}</p>}
                    {passportUrl && (
                      <div className="mt-2">
                        {passportIsPdf ? (
                          <div className="flex items-center gap-2 rounded-md bg-white/10 p-2">
                            <div className="size-10 rounded bg-white/20 grid place-items-center text-white/80 text-xs">PDF</div>
                            <span className="text-xs truncate">{passportFile?.name}</span>
                          </div>
                        ) : (
                          <img src={passportUrl} alt="Passport preview" className="w-full h-24 object-cover rounded-md bg-white/5" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-white">Additional Information</Label>
                  <Textarea id="additionalInfo" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 min-h-[120px]" placeholder="Any additional information or special requirements..." />
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing Application...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Submit Visa Application
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Your Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-white/90 text-sm">
              <div className="flex justify-between"><span>Visa Type</span><span>{visaType || '—'}</span></div>
              <div className="flex justify-between"><span>Duration</span><span>{duration || '—'}</span></div>
              <div className="flex justify-between"><span>Name</span><span>{fullName || '—'}</span></div>
              <div className="flex justify-between"><span>Email</span><span className="truncate max-w-[12rem]">{email || '—'}</span></div>
              <div className="flex justify-between"><span>Age</span><span>{age || '—'}</span></div>
              <div className="flex justify-between"><span>Birth Year</span><span>{birthYear || '—'}</span></div>
              <div className="flex justify-between"><span>Passport #</span><span className="truncate max-w-[12rem]">{passportNumber || '—'}</span></div>
              {bankUrl && (
                <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                  <div className="text-white">Bank Statement</div>
                  {bankIsPdf ? (
                    <div className="flex items-center gap-2 rounded-md bg-white/10 p-2">
                      <div className="size-10 rounded bg-white/20 grid place-items-center text-white/80 text-xs">PDF</div>
                      <span className="text-xs truncate">{bankFile?.name}</span>
                    </div>
                  ) : (
                    <img src={bankUrl} alt="Bank preview" className="w-full h-24 object-cover rounded-md bg-white/5" />
                  )}
                </div>
              )}
              {passportUrl && (
                <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                  <div className="text-white">Passport Copy</div>
                  {passportIsPdf ? (
                    <div className="flex items-center gap-2 rounded-md bg-white/10 p-2">
                      <div className="size-10 rounded bg-white/20 grid place-items-center text-white/80 text-xs">PDF</div>
                      <span className="text-xs truncate">{passportFile?.name}</span>
                    </div>
                  ) : (
                    <img src={passportUrl} alt="Passport preview" className="w-full h-24 object-cover rounded-md bg-white/5" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 inline-block">
            <CardContent className="p-6">
              <p className="text-gray-300 mb-2">Questions about your visa application?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="tel:+251962765453" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +251 962 765 453
                </a>
                <a href="tel:+251722765453" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +251 722 765 453
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
