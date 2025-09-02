"use client"

import React, { useState, useEffect } from 'react'
import { AdComponent } from './AdComponent'
import { Ad } from '@/lib/supabase'

interface SlideInAdProps {
  ad: Ad
  onClose: () => void
  onTrackClick?: (adId: string) => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const SlideInAd: React.FC<SlideInAdProps> = ({ 
  ad, 
  onClose, 
  onTrackClick, 
  position = 'right' 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return `fixed top-0 left-0 right-0 z-40 transform transition-transform duration-500 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`
      case 'bottom':
        return `fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`
      case 'left':
        return `fixed left-0 top-1/2 transform -translate-y-1/2 z-40 transition-transform duration-500 ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`
      case 'right':
        return `fixed right-0 top-1/2 transform -translate-y-1/2 z-40 transition-transform duration-500 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`
      default:
        return `fixed right-0 top-1/2 transform -translate-y-1/2 z-40 transition-transform duration-500 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`
    }
  }

  return (
    <div className={getPositionClasses()}>
      <div className="max-w-sm w-full mx-4">
        <AdComponent 
          ad={ad} 
          onClose={onClose}
          onTrackClick={onTrackClick}
        />
      </div>
    </div>
  )
}
