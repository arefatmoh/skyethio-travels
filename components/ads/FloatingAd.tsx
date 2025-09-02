"use client"

import React, { useState, useEffect } from 'react'
import { AdComponent } from './AdComponent'
import { Ad } from '@/lib/supabase'

interface FloatingAdProps {
  ad: Ad
  onClose: () => void
  onTrackClick?: (adId: string) => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export const FloatingAd: React.FC<FloatingAdProps> = ({ 
  ad, 
  onClose, 
  onTrackClick, 
  position = 'bottom-right' 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-40'
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-40'
      case 'top-right':
        return 'fixed top-4 right-4 z-40'
      case 'top-left':
        return 'fixed top-4 left-4 z-40'
      default:
        return 'fixed bottom-4 right-4 z-40'
    }
  }

  if (!isVisible) return null

  return (
    <div className={`${getPositionClasses()} transition-all duration-300 ${isMinimized ? 'scale-75 opacity-75' : 'scale-100 opacity-100'}`}>
      <div className="max-w-xs w-full">
        <AdComponent 
          ad={ad} 
          onClose={onClose}
          onTrackClick={onTrackClick}
        />
      </div>
    </div>
  )
}
