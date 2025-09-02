"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Info, Eye, Target, Clock, Users, Star, Zap, Bell, MessageSquare } from 'lucide-react'
import { Ad } from '@/lib/supabase'
import { toast } from 'sonner'

interface AdFormProps {
  ad?: Ad | null
  onClose: () => void
  onSave: (adData: Partial<Ad>) => Promise<void>
  isEditing?: boolean
}

export const AdForm: React.FC<AdFormProps> = ({ ad, onClose, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ad_type: 'popup' as const,
    content_type: 'promotional' as const,
    cta_text: '',
    cta_url: '',
    target_pages: [] as string[],
    target_audience: 'all' as const,
    priority: 1,
    is_active: true,
    start_date: '',
    end_date: '',
    max_impressions: '',
    image_url: '',
    video_url: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPages, setSelectedPages] = useState<string[]>([])

  const availablePages = [
    { value: '/', label: 'Home Page' },
    { value: '/book-ticket', label: 'Book Ticket' },
    { value: '/visa-application', label: 'Visa Application' },
    { value: '/services', label: 'Services' },
    { value: '/about', label: 'About Us' },
    { value: '/contact', label: 'Contact' }
  ]

  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title || '',
        description: ad.description || '',
        ad_type: ad.ad_type || 'popup',
        content_type: ad.content_type || 'promotional',
        cta_text: ad.cta_text || '',
        cta_url: ad.cta_url || '',
        target_pages: ad.target_pages || [],
        target_audience: ad.target_audience || 'all',
        priority: ad.priority || 1,
        is_active: ad.is_active ?? true,
        start_date: ad.start_date ? new Date(ad.start_date).toISOString().slice(0, 16) : '',
        end_date: ad.end_date ? new Date(ad.end_date).toISOString().slice(0, 16) : '',
        max_impressions: ad.max_impressions?.toString() || '',
        image_url: ad.image_url || '',
        video_url: ad.video_url || ''
      })
      setSelectedPages(ad.target_pages || [])
    }
  }, [ad])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePageToggle = (page: string) => {
    const newPages = selectedPages.includes(page)
      ? selectedPages.filter(p => p !== page)
      : [...selectedPages, page]
    setSelectedPages(newPages)
    handleInputChange('target_pages', newPages)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.ad_type) newErrors.ad_type = 'Ad type is required'
    if (!formData.content_type) newErrors.content_type = 'Content type is required'
    if (!formData.cta_text.trim()) newErrors.cta_text = 'Call-to-action text is required'
    if (!formData.cta_url.trim()) newErrors.cta_url = 'Call-to-action URL is required'
    if (selectedPages.length === 0) newErrors.target_pages = 'At least one target page is required'
    if (formData.priority < 1 || formData.priority > 10) newErrors.priority = 'Priority must be between 1-10'
    if (formData.max_impressions && (isNaN(Number(formData.max_impressions)) || Number(formData.max_impressions) < 1)) {
      newErrors.max_impressions = 'Max impressions must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving')
      return
    }

    setIsLoading(true)
    try {
      const adData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ad_type: formData.ad_type,
        content_type: formData.content_type,
        cta_text: formData.cta_text.trim(),
        cta_url: formData.cta_url.trim(),
        target_pages: selectedPages,
        target_audience: formData.target_audience,
        priority: Number(formData.priority),
        is_active: formData.is_active,
        max_impressions: formData.max_impressions ? Number(formData.max_impressions) : null,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        image_url: formData.image_url.trim() || null,
        video_url: formData.video_url.trim() || null
      }

      await onSave(adData)
      toast.success(isEditing ? 'Ad updated successfully!' : 'Ad created successfully!')
      onClose()
    } catch (error) {
      console.error('Error saving ad:', error)
      toast.error('Failed to save ad. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getAdTypeIcon = (type: string) => {
    switch (type) {
      case 'popup': return <Zap className="h-4 w-4" />
      case 'slide-in': return <MessageSquare className="h-4 w-4" />
      case 'banner': return <Eye className="h-4 w-4" />
      case 'floating': return <Star className="h-4 w-4" />
      case 'notification': return <Bell className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'promotional': return 'bg-blue-500'
      case 'offer': return 'bg-green-500'
      case 'announcement': return 'bg-purple-500'
      case 'service': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h2>
              <p className="text-gray-300 mt-1">
                {isEditing ? 'Update your advertisement settings' : 'Create a new advertisement for your website'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6">
              <TabsTrigger value="basic" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="targeting" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
                Targeting
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
                Preview
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-6">
                {/* Basic Information */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="Enter ad title"
                        />
                        {errors.title && <p className="text-red-300 text-sm">{errors.title}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-white">Priority (1-10) *</Label>
                        <Input
                          id="priority"
                          type="number"
                          min="1"
                          max="10"
                          value={formData.priority}
                          onChange={(e) => handleInputChange('priority', Number(e.target.value))}
                          className="bg-white/10 border-white/20 text-white"
                        />
                        {errors.priority && <p className="text-red-300 text-sm">{errors.priority}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                        placeholder="Enter ad description"
                      />
                      {errors.description && <p className="text-red-300 text-sm">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cta_text" className="text-white">Call-to-Action Text *</Label>
                        <Input
                          id="cta_text"
                          value={formData.cta_text}
                          onChange={(e) => handleInputChange('cta_text', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="e.g., Book Now, Learn More"
                        />
                        {errors.cta_text && <p className="text-red-300 text-sm">{errors.cta_text}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta_url" className="text-white">Call-to-Action URL *</Label>
                        <Input
                          id="cta_url"
                          value={formData.cta_url}
                          onChange={(e) => handleInputChange('cta_url', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="e.g., /book-ticket, /contact"
                        />
                        {errors.cta_url && <p className="text-red-300 text-sm">{errors.cta_url}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ad Type & Content Type */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Ad Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ad_type" className="text-white">Ad Type</Label>
                        <Select value={formData.ad_type} onValueChange={(value) => handleInputChange('ad_type', value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            <SelectItem value="popup" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Popup - Full screen overlay
                              </div>
                            </SelectItem>
                            <SelectItem value="slide-in" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Slide-in - Side panel
                              </div>
                            </SelectItem>
                            <SelectItem value="banner" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Banner - Top/bottom bar
                              </div>
                            </SelectItem>
                            <SelectItem value="floating" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                Floating - Corner widget
                              </div>
                            </SelectItem>
                            <SelectItem value="notification" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Notification - Toast message
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.ad_type && <p className="text-red-300 text-sm">{errors.ad_type}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content_type" className="text-white">Content Type</Label>
                        <Select value={formData.content_type} onValueChange={(value) => handleInputChange('content_type', value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            <SelectItem value="promotional" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                Promotional - Brand awareness
                              </div>
                            </SelectItem>
                            <SelectItem value="offer" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                Offer - Discounts & deals
                              </div>
                            </SelectItem>
                            <SelectItem value="announcement" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                Announcement - News & updates
                              </div>
                            </SelectItem>
                            <SelectItem value="service" className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                Service - Service promotion
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.content_type && <p className="text-red-300 text-sm">{errors.content_type}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                      />
                      <Label htmlFor="is_active" className="text-white">Active (show this ad)</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Media URLs */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Media (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url" className="text-white">Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => handleInputChange('image_url', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video_url" className="text-white">Video URL</Label>
                      <Input
                        id="video_url"
                        value={formData.video_url}
                        onChange={(e) => handleInputChange('video_url', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="targeting" className="space-y-6">
                {/* Target Pages */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Target Pages *
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availablePages.map((page) => (
                        <button
                          key={page.value}
                          type="button"
                          onClick={() => handlePageToggle(page.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedPages.includes(page.value)
                              ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                              : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                          }`}
                        >
                          <div className="text-sm font-medium">{page.label}</div>
                          <div className="text-xs text-gray-400">{page.value}</div>
                        </button>
                      ))}
                    </div>
                    {errors.target_pages && <p className="text-red-300 text-sm mt-2">{errors.target_pages}</p>}
                  </CardContent>
                </Card>

                {/* Target Audience */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Target Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={formData.target_audience} onValueChange={(value) => handleInputChange('target_audience', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="all" className="text-white hover:bg-white/10">
                          All Visitors
                        </SelectItem>
                        <SelectItem value="new_visitors" className="text-white hover:bg-white/10">
                          New Visitors Only
                        </SelectItem>
                        <SelectItem value="returning_visitors" className="text-white hover:bg-white/10">
                          Returning Visitors Only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Scheduling */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Scheduling (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date" className="text-white">Start Date</Label>
                        <Input
                          id="start_date"
                          type="datetime-local"
                          value={formData.start_date}
                          onChange={(e) => handleInputChange('start_date', e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date" className="text-white">End Date</Label>
                        <Input
                          id="end_date"
                          type="datetime-local"
                          value={formData.end_date}
                          onChange={(e) => handleInputChange('end_date', e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_impressions" className="text-white">Max Impressions (Optional)</Label>
                      <Input
                        id="max_impressions"
                        type="number"
                        min="1"
                        value={formData.max_impressions}
                        onChange={(e) => handleInputChange('max_impressions', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Leave empty for unlimited"
                      />
                      {errors.max_impressions && <p className="text-red-300 text-sm">{errors.max_impressions}</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                {/* Preview */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Ad Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getAdTypeIcon(formData.ad_type)}
                          <Badge className={`${getContentTypeColor(formData.content_type)} text-white`}>
                            {formData.content_type}
                          </Badge>
                          <Badge className="bg-white/20 text-white">
                            Priority: {formData.priority}
                          </Badge>
                        </div>
                        <Badge className={formData.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                          {formData.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{formData.title || 'Ad Title'}</h3>
                      <p className="text-white/90 mb-4">{formData.description || 'Ad description will appear here...'}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-white/70">
                          Target: {formData.target_audience} • Pages: {selectedPages.length}
                        </div>
                        <Button className="bg-white/20 hover:bg-white/30 text-white">
                          {formData.cta_text || 'Call to Action'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ad Information */}
                <Alert className="bg-blue-500/10 border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    <strong>Ad Types:</strong> Popup (full screen), Slide-in (side panel), Banner (top/bottom), 
                    Floating (corner), Notification (toast). Higher priority ads show first.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-white/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-white/30 text-white bg-white/10 hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    isEditing ? 'Update Ad' : 'Create Ad'
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
