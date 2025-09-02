"use client"

import React, { useState, useEffect } from 'react'
import { Ad } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { PopupAd } from './PopupAd'
import { SlideInAd } from './SlideInAd'
import { FloatingAd } from './FloatingAd'
import { BannerAd } from './BannerAd'
import { NotificationAd } from './NotificationAd'

interface AdManagerProps {
  currentPage: string
  isNewVisitor?: boolean
  className?: string
}

export const AdManager: React.FC<AdManagerProps> = ({ 
  currentPage, 
  isNewVisitor = false,
  className = ""
}) => {
  const [ads, setAds] = useState<Ad[]>([])
  const [activeAds, setActiveAds] = useState<Ad[]>([])
  const [closedAds, setClosedAds] = useState<Set<string>>(new Set())
  const [sessionClosedAds, setSessionClosedAds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAds()
  }, [])

  // Handle page changes - reset closed ads for new pages
  useEffect(() => {
    setClosedAds(new Set())
  }, [currentPage])

  useEffect(() => {
    filterActiveAds()
  }, [ads, currentPage, isNewVisitor, sessionClosedAds, closedAds])

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })

      if (error) throw error

      setAds(data || [])
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterActiveAds = () => {
    const now = new Date()
    
    const filtered = ads.filter(ad => {
      // Check if ad is closed in current page
      if (closedAds.has(ad.id)) return false
      
      // Check if ad is closed in current session (for same page)
      if (sessionClosedAds.has(ad.id)) return false

      // Check date range
      if (ad.start_date && new Date(ad.start_date) > now) return false
      if (ad.end_date && new Date(ad.end_date) < now) return false

      // Check impression limit
      if (ad.max_impressions && ad.current_impressions >= ad.max_impressions) return false

      // Check target pages
      if (ad.target_pages && ad.target_pages.length > 0) {
        if (!ad.target_pages.includes(currentPage) && !ad.target_pages.includes('*')) {
          return false
        }
      }

      // Check target audience
      if (ad.target_audience === 'new_visitors' && !isNewVisitor) return false
      if (ad.target_audience === 'returning_visitors' && isNewVisitor) return false

      return true
    })

    setActiveAds(filtered)
  }

  const handleCloseAd = (adId: string) => {
    console.log('Closing ad:', adId)
    setClosedAds(prev => new Set([...prev, adId]))
    setSessionClosedAds(prev => new Set([...prev, adId]))
  }

  const handleTrackClick = (adId: string) => {
    // Additional click tracking logic can be added here
    console.log('Ad clicked:', adId)
  }

  const renderAd = (ad: Ad) => {
    const key = `${ad.id}-${ad.ad_type}`

    switch (ad.ad_type) {
      case 'popup':
        return (
          <PopupAd
            key={key}
            ad={ad}
            onClose={() => handleCloseAd(ad.id)}
            onTrackClick={handleTrackClick}
          />
        )
      case 'slide-in':
        return (
          <SlideInAd
            key={key}
            ad={ad}
            onClose={() => handleCloseAd(ad.id)}
            onTrackClick={handleTrackClick}
            position="right"
          />
        )
      case 'floating':
        return (
          <FloatingAd
            key={key}
            ad={ad}
            onClose={() => handleCloseAd(ad.id)}
            onTrackClick={handleTrackClick}
            position="bottom-right"
          />
        )
      case 'banner':
        return (
          <BannerAd
            key={key}
            ad={ad}
            onClose={() => handleCloseAd(ad.id)}
            onTrackClick={handleTrackClick}
            className={className}
          />
        )
      case 'notification':
        return (
          <NotificationAd
            key={key}
            ad={ad}
            onClose={() => handleCloseAd(ad.id)}
            onTrackClick={handleTrackClick}
          />
        )
      default:
        return null
    }
  }

  if (loading) return null

  return (
    <>
      {activeAds.map(renderAd)}
    </>
  )
}
