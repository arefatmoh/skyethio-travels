"use client"

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import promotionalAdsData from '@/data/promotional-ads.json'

interface PromotionalAd {
  id: string
  title: string
  description: string
  ad_type: 'banner' | 'popup' | 'slide-in' | 'floating' | 'notification'
  content_type: 'promotional' | 'offer' | 'announcement' | 'service'
  cta_text: string
  cta_url: string
  target_pages: string[]
  target_audience: 'all' | 'new_visitors' | 'returning_visitors'
  priority: number
  image_url: string | null
  start_date: string
  end_date: string
}

export const AdImporter: React.FC = () => {
  useEffect(() => {
    importPromotionalAds()
  }, [])

  const importPromotionalAds = async () => {
    try {
      // First, check if ads table exists by trying to select from it
      const { data: testData, error: testError } = await supabase
        .from('ads')
        .select('id')
        .limit(1)

      if (testError) {
        console.error('Ads table not accessible:', testError)
        console.log('Please run the database migration first to create the ads table.')
        return
      }

      // Check if ads already exist
      const { data: existingAds, error: checkError } = await supabase
        .from('ads')
        .select('id')
        .in('id', promotionalAdsData.skyethio_travels_ads.map(ad => ad.id))

      if (checkError) {
        console.error('Error checking existing ads:', checkError)
        return
      }

      const existingIds = existingAds?.map(ad => ad.id) || []
      const newAds = promotionalAdsData.skyethio_travels_ads.filter(ad => !existingIds.includes(ad.id))

      if (newAds.length === 0) {
        console.log('All promotional ads already exist in database')
        return
      }

      // Prepare ads for insertion
      const adsToInsert = newAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        ad_type: ad.ad_type,
        content_type: ad.content_type,
        image_url: ad.image_url,
        video_url: null,
        cta_text: ad.cta_text,
        cta_url: ad.cta_url,
        target_pages: ad.target_pages,
        target_audience: ad.target_audience,
        priority: ad.priority,
        is_active: true,
        start_date: ad.start_date,
        end_date: ad.end_date,
        max_impressions: null,
        current_impressions: 0,
        click_count: 0,
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      // Insert new ads
      const { data, error } = await supabase
        .from('ads')
        .insert(adsToInsert)

      if (error) {
        console.error('Error importing promotional ads:', error)
      } else {
        console.log(`Successfully imported ${newAds.length} promotional ads:`, newAds.map(ad => ad.title))
      }
    } catch (error) {
      console.error('Error in importPromotionalAds:', error)
    }
  }

  return null // This component doesn't render anything
}
