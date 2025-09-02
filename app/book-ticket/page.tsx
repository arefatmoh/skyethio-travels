"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plane, User, Phone, MapPin, Clock, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function BookTicketPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>("round-trip")
  const [passengers, setPassengers] = useState(1)
  const [travelClass, setTravelClass] = useState<'economy' | 'business' | 'first'>("economy")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [passportNumber, setPassportNumber] = useState("")
  const [departure, setDeparture] = useState("")
  const [destination, setDestination] = useState("")
  const [airline, setAirline] = useState<string | undefined>(undefined)
  const [notes, setNotes] = useState("")
  const [dateDepart, setDateDepart] = useState<Date | undefined>(undefined)
  const [dateReturn, setDateReturn] = useState<Date | undefined>(undefined)
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [passportUrl, setPassportUrl] = useState<string | null>(null)
  const [passportIsPdf, setPassportIsPdf] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formatHuman = (d?: Date) => d ? d.toISOString().slice(0, 10) : ''
  const stayDays = dateDepart && dateReturn ? Math.max(0, Math.ceil((dateReturn.getTime() - dateDepart.getTime()) / (1000 * 60 * 60 * 24))) : null

  // Persist form data (except file) to localStorage
  const saveKey = 'book_ticket_form_v1'
  // Load on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(saveKey)
      if (raw) {
        const data = JSON.parse(raw)
        setFullName(data.fullName ?? "")
        setPhone(data.phone ?? "")
        setEmail(data.email ?? "")
        setPassportNumber(data.passportNumber ?? "")
        setDeparture(data.departure ?? "")
        setDestination(data.destination ?? "")
        setAirline(data.airline ?? undefined)
        setNotes(data.notes ?? "")
        setTripType((data.tripType as any) ?? 'round-trip')
        setPassengers(data.passengers ?? 1)
        setTravelClass((data.travelClass as any) ?? 'economy')
        setDateDepart(data.dateDepart ? new Date(data.dateDepart) : undefined)
        setDateReturn(data.dateReturn ? new Date(data.dateReturn) : undefined)
      }
    } catch {}
  }, [])
  // Save on change
  useEffect(() => {
    if (typeof window === 'undefined') return
    const data = {
      fullName, phone, email, passportNumber, departure, destination, airline, notes,
      tripType, passengers, travelClass,
      dateDepart: dateDepart ? dateDepart.toISOString() : null,
      dateReturn: dateReturn ? dateReturn.toISOString() : null,
    }
    try { localStorage.setItem(saveKey, JSON.stringify(data)) } catch {}
  }, [fullName, phone, email, passportNumber, departure, destination, airline, notes, tripType, passengers, travelClass, dateDepart, dateReturn])

  // Build preview URL for passport file
  useEffect(() => {
    if (!passportFile) {
      if (passportUrl) URL.revokeObjectURL(passportUrl)
      setPassportUrl(null)
      setPassportIsPdf(false)
      return
    }
    const url = URL.createObjectURL(passportFile)
    setPassportUrl(url)
    setPassportIsPdf(/pdf$/i.test(passportFile.type) || /\.pdf$/i.test(passportFile.name))
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [passportFile])

  const airlines = [
    "American Airlines",
    "SAUDIA",
    "Flydubai",
    "EGYPTAIR",
    "Emirates",
    "KUWAIT AIRWAYS",
    "TURKISH AIRLINES",
    "QATAR AIRWAYS",
    "Kenyan Airlines",
    "ETIHAD AIRWAYS",
    "AirArabia",
    "Nas Air",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Inline validation
    const newErrors: Record<string, string> = {}
    if (!fullName.trim()) newErrors.fullName = "Full name is required."
    if (!phone.trim()) newErrors.phone = "Phone number is required."
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Valid email is required."
    if (!passportNumber.trim()) newErrors.passportNumber = "Passport number is required."
    if (!departure.trim()) newErrors.departure = "Departure city is required."
    if (!destination.trim()) newErrors.destination = "Destination is required."
    if (!dateDepart) newErrors.travelDate = "Departure date is required."
    if (tripType === 'round-trip' && !dateReturn) newErrors.travelDate = "Return date is required."
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }
    setErrors({})

    try {
      let passportFileUrl = null;

      // Upload passport file to Supabase Storage if provided
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

      // Save to Supabase database
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            passport_number: passportNumber,
            departure_city: departure,
            destination: destination,
            departure_date: dateDepart?.toISOString(),
            return_date: dateReturn?.toISOString(),
            trip_type: tripType,
            passengers: passengers,
            travel_class: travelClass,
            preferred_airline: airline || null,
            notes: notes || null,
            passport_file_url: passportFileUrl,
            status: 'pending',
            total_amount: 0 // Will be calculated by admin
          }
        ])
        .select()

      if (error) {
        console.error('Error saving booking:', error)
        toast.error('Failed to submit booking. Please try again.')
        setIsLoading(false)
        return
      }

      // Clear form data from localStorage
      localStorage.removeItem(saveKey)
      
      toast.success('Booking submitted successfully!')
      setIsLoading(false)
      setIsSubmitted(true)
      
    } catch (error) {
      console.error('Error submitting booking:', error)
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
            <h2 className="text-2xl font-bold text-white mb-4">Booking Submitted!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for choosing SkyEthio Travels. We'll contact you within 24 hours to confirm your booking
              details.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Book Another Ticket
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Book Your Flight
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Fill out the form below and we'll find you the best deals for your journey
          </p>
        </div>

        {/* Form + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl overflow-hidden lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Plane className="h-6 w-6 text-blue-400" />
                Flight Booking Form
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="Enter your full name"
                      aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && <p className="text-red-300 text-sm">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="+251 XXX XXX XXX"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="text-red-300 text-sm">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="your.email@example.com"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="text-red-300 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportNumber" className="text-white">
                      Passport Number *
                    </Label>
                    <Input
                      id="passportNumber"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="Enter passport number"
                      aria-invalid={!!errors.passportNumber}
                    />
                    {errors.passportNumber && <p className="text-red-300 text-sm">{errors.passportNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Trip Type */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  Trip Type
                </h3>

                <RadioGroup value={tripType} onValueChange={(v) => setTripType(v as any)} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="round-trip" id="round-trip" className="border-white/30 text-blue-400" />
                    <Label htmlFor="round-trip" className="text-white">
                      Round Trip
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-way" id="one-way" className="border-white/30 text-blue-400" />
                    <Label htmlFor="one-way" className="text-white">
                      One Way
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Flight Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  Flight Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="departure" className="text-white">
                      Departure City *
                    </Label>
                    <Input
                      id="departure"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="e.g., Addis Ababa"
                      aria-invalid={!!errors.departure}
                    />
                    {errors.departure && <p className="text-red-300 text-sm">{errors.departure}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-white">
                      Destination *
                    </Label>
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="e.g., Dubai"
                      aria-invalid={!!errors.destination}
                    />
                    {errors.destination && <p className="text-red-300 text-sm">{errors.destination}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-white">Departure Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-white/10 hover:bg-white/15 border-white/20 text-white rounded-xl h-11 backdrop-blur">
                          <CalendarIcon className="mr-2 h-4 w-4 text-white/70" />
                          <span>{dateDepart ? formatHuman(dateDepart) : 'Select date'}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
                        <Calendar mode="single" selected={dateDepart} onSelect={setDateDepart} numberOfMonths={1} />
                      </PopoverContent>
                    </Popover>
                    {errors.travelDate && !dateDepart && <p className="text-red-300 text-xs">{errors.travelDate}</p>}
                  </div>

                  {tripType === 'round-trip' && (
                    <div className="space-y-1.5">
                      <Label className="text-white">Return Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start bg-white/10 hover:bg-white/15 border-white/20 text-white rounded-xl h-11 backdrop-blur">
                            <CalendarIcon className="mr-2 h-4 w-4 text-white/70" />
                            <span>{dateReturn ? formatHuman(dateReturn) : 'Select date'}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
                          <Calendar mode="single" selected={dateReturn} onSelect={setDateReturn} numberOfMonths={1} />
                        </PopoverContent>
                      </Popover>
                      {errors.travelDate && !dateReturn && <p className="text-red-300 text-xs">{errors.travelDate}</p>}
                      {stayDays !== null && dateDepart && dateReturn && (
                        <p className="text-white/70 text-xs">Stay: {stayDays} day{stayDays === 1 ? '' : 's'}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="airline" className="text-white">
                      Preferred Airline
                    </Label>
                    <Select value={airline} onValueChange={setAirline}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select airline" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        {airlines.map((airline) => (
                          <SelectItem
                            key={airline}
                            value={airline}
                            className="text-white hover:bg-white/10"
                          >
                            {airline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-white">
                      Passengers
                    </Label>
                    <Select value={String(passengers)} onValueChange={(v) => setPassengers(Number(v))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <SelectItem key={i+1} value={String(i + 1)} className="text-white hover:bg-white/10">
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class" className="text-white">
                      Class
                    </Label>
                    <Select value={travelClass} onValueChange={(v) => setTravelClass(v as any)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Economy" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="economy" className="text-white hover:bg-white/10">Economy</SelectItem>
                        <SelectItem value="business" className="text-white hover:bg-white/10">Business</SelectItem>
                        <SelectItem value="first" className="text-white hover:bg-white/10">First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-white">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 min-h-[100px]"
                  placeholder="Any special requests or additional information..."
                />
              </div>

              {/* Passport Upload - full clickable box */}
              <div className="space-y-2">
                <Label className="text-white">Passport/ID (Optional)</Label>
                <label htmlFor="passport" className="block cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-white/80 text-sm truncate">
                      {passportFile ? passportFile.name : 'Click to upload image or PDF'}
                    </div>
                    <div className="text-white/70 text-xs rounded-full px-2 py-1 bg-white/10">Add File</div>
                  </div>
                </label>
                <Input id="passport" type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setPassportFile(e.target.files?.[0] ?? null)} />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Submit Booking Request
                  </div>
                )}
              </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary Sidebar */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10 sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Your Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-white/90 text-sm">
              <div className="flex justify-between"><span>Name</span><span>{fullName || '—'}</span></div>
              <div className="flex justify-between"><span>Phone</span><span>{phone || '—'}</span></div>
              <div className="flex justify-between"><span>Email</span><span className="truncate max-w-[12rem]">{email || '—'}</span></div>
              <div className="flex justify-between"><span>Passport #</span><span className="truncate max-w-[12rem]">{passportNumber || '—'}</span></div>
              <div className="flex justify-between"><span>Route</span><span>{departure || '—'} → {destination || '—'}</span></div>
              <div className="flex justify-between"><span>Dates</span><span>{dateDepart ? formatHuman(dateDepart) : '—'}{tripType === 'round-trip' ? ` → ${dateReturn ? formatHuman(dateReturn) : '—'}` : ''}</span></div>
              <div className="flex justify-between"><span>Passengers</span><span>{passengers}</span></div>
              <div className="flex justify-between"><span>Class</span><span>{travelClass}</span></div>
              <div className="flex justify-between"><span>Airline</span><span>{airline || '—'}</span></div>
              {passportUrl && (
                <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                  <div className="text-white">Passport Preview</div>
                  {passportIsPdf ? (
                    <iframe src={passportUrl} className="w-full h-40 rounded-md bg-white" />
                  ) : (
                    <img src={passportUrl} alt="Passport preview" className="w-full max-h-48 object-contain rounded-md bg-white/5" />
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
              <p className="text-gray-300 mb-2">Need immediate assistance?</p>
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
