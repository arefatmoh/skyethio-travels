"use client"

import React from 'react'
import { AdComponent } from './AdComponent'
import { Ad } from '@/lib/supabase'

interface BannerAdProps {
  ad: Ad
  onClose?: () => void
  onTrackClick?: (adId: string) => void
  className?: string
}

export const BannerAd: React.FC<BannerAdProps> = ({ 
  ad, 
  onClose, 
  onTrackClick, 
  className = "" 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <AdComponent 
        ad={ad} 
        onClose={onClose}
        onTrackClick={onTrackClick}
      />
    </div>
  )
}
