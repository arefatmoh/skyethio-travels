import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import promotionalAdsData from '@/data/promotional-ads.json'

export async function POST(request: NextRequest) {
  try {
    // First, check if ads table exists
    const { data: testData, error: testError } = await supabase
      .from('ads')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('Ads table not accessible:', testError)
      return NextResponse.json({ 
        error: 'Ads table not found. Please run the database migration first.' 
      }, { status: 500 })
    }

    // Check if ads already exist
    const { data: existingAds, error: checkError } = await supabase
      .from('ads')
      .select('id')
      .in('id', promotionalAdsData.skyethio_travels_ads.map(ad => ad.id))

    if (checkError) {
      console.error('Error checking existing ads:', checkError)
      return NextResponse.json({ error: 'Failed to check existing ads' }, { status: 500 })
    }

    const existingIds = existingAds?.map(ad => ad.id) || []
    const newAds = promotionalAdsData.skyethio_travels_ads.filter(ad => !existingIds.includes(ad.id))

    if (newAds.length === 0) {
      return NextResponse.json({ 
        message: 'All promotional ads already exist in database',
        imported: 0 
      })
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
      created_by: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Insert new ads
    const { data, error } = await supabase
      .from('ads')
      .insert(adsToInsert)

    if (error) {
      console.error('Error importing promotional ads:', error)
      return NextResponse.json({ error: 'Failed to import ads' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Successfully imported ${newAds.length} promotional ads`,
      imported: newAds.length,
      ads: newAds.map(ad => ad.title)
    })

  } catch (error) {
    console.error('Error in import-ads API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
