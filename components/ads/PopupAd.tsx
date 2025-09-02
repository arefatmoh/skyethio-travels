"use client"

import React from 'react'
import { AdComponent } from './AdComponent'
import { Ad } from '@/lib/supabase'

interface PopupAdProps {
  ad: Ad
  onClose: () => void
  onTrackClick?: (adId: string) => void
}

export const PopupAd: React.FC<PopupAdProps> = ({ ad, onClose, onTrackClick }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="max-w-md w-full">
        <AdComponent 
          ad={ad} 
          onClose={onClose}
          onTrackClick={onTrackClick}
        />
      </div>
    </div>
  )
}
