"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Info, 
  Zap, 
  MessageSquare, 
  Eye, 
  Star, 
  Bell, 
  Target, 
  Users, 
  Clock, 
  BarChart3,
  Lightbulb,
  Settings,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export const AdSystemGuide: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const adTypes = [
    {
      type: 'popup',
      icon: <Zap className="h-5 w-5" />,
      name: 'Popup Ads',
      description: 'Full-screen overlay with backdrop blur',
      useCase: 'High-impact announcements, special offers',
      pros: ['Maximum visibility', 'High engagement', 'Perfect for important announcements'],
      cons: ['Can be intrusive', 'May affect user experience'],
      bestFor: 'Limited-time offers, major announcements'
    },
    {
      type: 'slide-in',
      icon: <MessageSquare className="h-5 w-5" />,
      name: 'Slide-in Ads',
      description: 'Side panel that slides in from the edge',
      useCase: 'Service promotions, secondary offers',
      pros: ['Less intrusive', 'Good visibility', 'Easy to dismiss'],
      cons: ['May be ignored', 'Limited space'],
      bestFor: 'Service promotions, newsletter signups'
    },
    {
      type: 'banner',
      icon: <Eye className="h-5 w-5" />,
      name: 'Banner Ads',
      description: 'Top or bottom bar that stays visible',
      useCase: 'Persistent messaging, navigation aids',
      pros: ['Always visible', 'Non-intrusive', 'Good for navigation'],
      cons: ['Limited attention', 'May be ignored'],
      bestFor: 'Navigation aids, persistent messaging'
    },
    {
      type: 'floating',
      icon: <Star className="h-5 w-5" />,
      name: 'Floating Ads',
      description: 'Corner widget that follows scroll',
      useCase: 'Quick actions, contact information',
      pros: ['Always accessible', 'Non-intrusive', 'Good for CTAs'],
      cons: ['Small size', 'May be overlooked'],
      bestFor: 'Contact info, quick actions, help buttons'
    },
    {
      type: 'notification',
      icon: <Bell className="h-5 w-5" />,
      name: 'Notification Ads',
      description: 'Toast message that appears briefly',
      useCase: 'Quick updates, confirmations',
      pros: ['Minimal disruption', 'Quick to read', 'Good for updates'],
      cons: ['Very brief', 'Easy to miss'],
      bestFor: 'Quick updates, confirmations, tips'
    }
  ]

  const contentTypes = [
    {
      type: 'promotional',
      color: 'bg-blue-500',
      name: 'Promotional',
      description: 'Brand awareness and general marketing',
      examples: ['Company introduction', 'Service highlights', 'Brand messaging']
    },
    {
      type: 'offer',
      color: 'bg-green-500',
      name: 'Offer',
      description: 'Discounts, deals, and special promotions',
      examples: ['20% off flights', 'Summer special', 'Group discounts']
    },
    {
      type: 'announcement',
      color: 'bg-purple-500',
      name: 'Announcement',
      description: 'News, updates, and important information',
      examples: ['New destinations', 'Service updates', 'Policy changes']
    },
    {
      type: 'service',
      color: 'bg-orange-500',
      name: 'Service',
      description: 'Specific service promotions and features',
      examples: ['Visa assistance', 'Travel insurance', 'Business travel']
    }
  ]

  const targetingStrategies = [
    {
      audience: 'all',
      name: 'All Visitors',
      description: 'Show to everyone',
      useCase: 'General promotions, brand awareness',
      icon: <Users className="h-4 w-4" />
    },
    {
      audience: 'new_visitors',
      name: 'New Visitors',
      description: 'First-time visitors only',
      useCase: 'Welcome messages, company introduction',
      icon: <Target className="h-4 w-4" />
    },
    {
      audience: 'returning_visitors',
      name: 'Returning Visitors',
      description: 'Repeat visitors only',
      useCase: 'Loyalty programs, advanced services',
      icon: <Star className="h-4 w-4" />
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white text-2xl">Advertisement System Guide</CardTitle>
              <p className="text-gray-300 mt-1">
                Complete guide to managing and optimizing your website advertisements
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 mb-6">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Overview
          </TabsTrigger>
          <TabsTrigger value="types" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Ad Types
          </TabsTrigger>
          <TabsTrigger value="targeting" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Targeting
          </TabsTrigger>
          <TabsTrigger value="best-practices" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Best Practices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Overview */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Info className="h-5 w-5" />
                How the Ad System Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-blue-400" />
                    <h3 className="font-semibold text-white">1. Create Ads</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Design your advertisements with different types, content, and targeting options.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-400" />
                    <h3 className="font-semibold text-white">2. Set Targeting</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Choose which pages to show ads on and which audience to target.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <h3 className="font-semibold text-white">3. Monitor Performance</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Track impressions, clicks, and engagement to optimize your campaigns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white">5 Different Ad Types</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white">Smart Targeting System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-white">Priority-based Display</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-white">Auto-close Timers</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white">Scheduling Controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white">Impression Limits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-white">Performance Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-white">Pre-made Templates</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Alert className="bg-green-500/10 border-green-500/20">
            <Lightbulb className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              <strong>Quick Start:</strong> Use the "Import Pre-made Ads" button to get started with 
              professional promotional ads, then customize them or create your own!
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          {adTypes.map((adType) => (
            <Card key={adType.type} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {adType.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white">{adType.name}</CardTitle>
                      <p className="text-gray-300 text-sm">{adType.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {adType.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Use Case</h4>
                    <p className="text-gray-300 text-sm mb-3">{adType.useCase}</p>
                    
                    <h4 className="font-semibold text-white mb-2">Best For</h4>
                    <p className="text-gray-300 text-sm">{adType.bestFor}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Pros</h4>
                    <ul className="space-y-1 mb-3">
                      {adType.pros.map((pro, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-green-300">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {pro}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold text-white mb-2">Cons</h4>
                    <ul className="space-y-1">
                      {adType.cons.map((con, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-red-300">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="targeting" className="space-y-6">
          {/* Audience Targeting */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Audience Targeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {targetingStrategies.map((strategy) => (
                  <div key={strategy.audience} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {strategy.icon}
                      <h3 className="font-semibold text-white">{strategy.name}</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{strategy.description}</p>
                    <p className="text-blue-300 text-xs">{strategy.useCase}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Page Targeting */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Page Targeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { page: '/', name: 'Home Page', use: 'General promotions' },
                  { page: '/book-ticket', name: 'Book Ticket', use: 'Flight offers' },
                  { page: '/visa-application', name: 'Visa Application', use: 'Visa services' },
                  { page: '/services', name: 'Services', use: 'Service highlights' },
                  { page: '/about', name: 'About Us', use: 'Company info' },
                  { page: '/contact', name: 'Contact', use: 'Contact prompts' }
                ].map((page) => (
                  <div key={page.page} className="bg-white/5 p-3 rounded-lg">
                    <div className="font-medium text-white text-sm">{page.name}</div>
                    <div className="text-gray-400 text-xs">{page.page}</div>
                    <div className="text-blue-300 text-xs mt-1">{page.use}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Types */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Content Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTypes.map((type) => (
                  <div key={type.type} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <h3 className="font-semibold text-white">{type.name}</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{type.description}</p>
                    <div className="space-y-1">
                      {type.examples.map((example, index) => (
                        <div key={index} className="text-blue-300 text-xs">• {example}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          {/* Best Practices */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Do's
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Keep messages clear and concise
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Use high-quality images and videos
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Test different ad types for your audience
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Set appropriate impression limits
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Monitor performance and adjust accordingly
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Don'ts
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      Don't overwhelm users with too many ads
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      Avoid misleading or false claims
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      Don't use low-quality or pixelated images
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      Avoid showing the same ad repeatedly
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      Don't ignore user feedback and behavior
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Tips */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">A/B Testing</h3>
                  <p className="text-gray-300 text-sm">
                    Test different titles, descriptions, and CTAs to see what works best for your audience.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Timing</h3>
                  <p className="text-gray-300 text-sm">
                    Use scheduling to show ads at optimal times when your audience is most active.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Frequency</h3>
                  <p className="text-gray-300 text-sm">
                    Set impression limits to avoid ad fatigue and maintain user experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              <strong>Track These Metrics:</strong> Impressions (how many times shown), 
              Clicks (user engagement), and Conversion (desired actions taken). 
              Higher priority ads show first, so use this strategically!
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
