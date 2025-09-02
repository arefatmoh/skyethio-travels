"use client"

import React, { useState, useEffect } from 'react'
import { AdComponent } from './AdComponent'
import { Ad } from '@/lib/supabase'

interface NotificationAdProps {
  ad: Ad
  onClose: () => void
  onTrackClick?: (adId: string) => void
}

export const NotificationAd: React.FC<NotificationAdProps> = ({ 
  ad, 
  onClose, 
  onTrackClick 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-500 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <AdComponent 
        ad={ad} 
        onClose={onClose}
        onTrackClick={onTrackClick}
      />
    </div>
  )
}
