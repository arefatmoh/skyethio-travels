"use client"

import React, { useState, useEffect } from 'react'
import { X, ExternalLink, Star, Gift, Megaphone, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Ad } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface AdComponentProps {
  ad: Ad
  onClose?: () => void
  onTrackClick?: (adId: string) => void
}

const getContentTypeIcon = (contentType: string) => {
  switch (contentType) {
    case 'offer': return <Gift className="h-4 w-4" />
    case 'promotional': return <Star className="h-4 w-4" />
    case 'announcement': return <Megaphone className="h-4 w-4" />
    case 'service': return <Info className="h-4 w-4" />
    default: return <Star className="h-4 w-4" />
  }
}

const getContentTypeColor = (contentType: string) => {
  switch (contentType) {
    case 'offer': return 'from-orange-500 to-red-500'
    case 'promotional': return 'from-blue-500 to-purple-500'
    case 'announcement': return 'from-green-500 to-teal-500'
    case 'service': return 'from-indigo-500 to-blue-500'
    default: return 'from-blue-500 to-purple-500'
  }
}

export const AdComponent: React.FC<AdComponentProps> = ({ ad, onClose, onTrackClick }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null)
  const [progress, setProgress] = useState<number>(100)

  useEffect(() => {
    // Track impression
    const trackImpression = async () => {
      try {
        await supabase
          .from('ads')
          .update({ current_impressions: ad.current_impressions + 1 })
          .eq('id', ad.id)
      } catch (error) {
        console.error('Error tracking impression:', error)
      }
    }

    trackImpression()
    
    // Show ad with animation delay
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    // Auto-close timer based on ad type
    const getAutoCloseDelay = () => {
      switch (ad.ad_type) {
        case 'popup': return 8000 // 8 seconds
        case 'slide-in': return 6000 // 6 seconds
        case 'floating': return 10000 // 10 seconds
        case 'notification': return 5000 // 5 seconds
        case 'banner': return 15000 // 15 seconds
        default: return 8000
      }
    }

    const autoCloseDelay = getAutoCloseDelay()
    setProgress(100)
    
    // Progress bar countdown
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (autoCloseDelay / 100))
        if (newProgress <= 0) {
          clearInterval(progressInterval)
          return 0
        }
        return newProgress
      })
    }, 100)
    
    const autoTimer = setTimeout(() => {
      if (onClose) {
        handleClose()
      }
    }, autoCloseDelay)

    setAutoCloseTimer(autoTimer)

    return () => {
      clearTimeout(showTimer)
      if (autoTimer) clearTimeout(autoTimer)
      clearInterval(progressInterval)
    }
  }, [ad.id, ad.current_impressions, ad.ad_type, onClose])

  const handleClose = () => {
    console.log('AdComponent handleClose called for ad:', ad.id)
    
    // Clear auto-close timer if manually closed
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      setAutoCloseTimer(null)
    }
    
    setIsClosing(true)
    setTimeout(() => {
      console.log('Calling onClose for ad:', ad.id)
      onClose?.()
    }, 300)
  }

  const handleClick = async () => {
    // Track click
    try {
      await supabase
        .from('ads')
        .update({ click_count: ad.click_count + 1 })
        .eq('id', ad.id)
    } catch (error) {
      console.error('Error tracking click:', error)
    }

    onTrackClick?.(ad.id)
    
    // Open link
    if (ad.cta_url.startsWith('http')) {
      window.open(ad.cta_url, '_blank')
    } else {
      window.location.href = ad.cta_url
    }
  }

  const gradientClass = getContentTypeColor(ad.content_type)
  const icon = getContentTypeIcon(ad.content_type)

  return (
    <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${isClosing ? 'opacity-0 scale-95' : ''}`}>
      <Card className={`bg-gradient-to-r ${gradientClass} border-0 shadow-2xl overflow-hidden relative`}>
        <CardContent className="p-0">
          {/* Close Button */}
          {onClose && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Auto-close Progress Bar */}
          {onClose && progress > 0 && (
            <div className="absolute top-2 left-2 right-2 z-20">
              <div className="bg-black/20 rounded-full h-1 overflow-hidden">
                <div 
                  className="bg-white/80 h-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Ad Content */}
          <div className="p-6 text-white">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              {icon}
              <span className="text-sm font-medium uppercase tracking-wide opacity-90">
                {ad.content_type}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 leading-tight">
              {ad.title}
            </h3>

            {/* Description */}
            {ad.description && (
              <p className="text-white/90 mb-4 text-sm leading-relaxed">
                {ad.description}
              </p>
            )}

            {/* Image */}
            {ad.image_url && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            {/* CTA Button */}
            <Button
              onClick={handleClick}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-200 transform hover:scale-105"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {ad.cta_text}
            </Button>

            {/* Footer */}
            <div className="mt-3 text-xs text-white/70 text-center">
              SkyEthio Travels
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
