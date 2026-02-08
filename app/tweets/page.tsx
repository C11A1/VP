'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, Bell, MessageSquare, Settings, Zap, MapPin, Users, Heart } from 'lucide-react'
import Image from 'next/image'
import storage from '@/lib/supabase-storage'
import TwitterPostFeed from '@/components/twitter-post-feed'
import { Button } from '@/components/ui/button'

interface TweetData {
  id: string
  author: string
  handle: string
  avatar: string
  avatarImage?: string | null
  content: string
  image?: string | null
  images?: string[] | null
  created_at: string
  likes: number
  likedByAdmin?: boolean
  edited?: boolean
  updatedAt?: string
}

const navigationTabs = [
  { label: 'Latest', id: 'latest' },
  { label: 'Popular', id: 'popular' },
  { label: 'Following', id: 'following' },
  { label: 'Trending', id: 'trending' },
]

const quickActions = [
  { icon: MapPin, label: 'Location' },
  { icon: Users, label: 'Community' },
  { icon: Heart, label: 'Liked' },
  { icon: Zap, label: 'Trending' },
]

export default function TweetsPage() {
  const [tweets, setTweets] = useState<TweetData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setIsLoading(true)
        const [adminData, userTweets] = await Promise.all([
          storage.getAdminData(),
          storage.getUserTweets()
        ])

        const adminTweets = adminData.adminTweets || []
        const allTweets = [...adminTweets, ...userTweets]
        
        // Sort by created_at (newest first)
        const sortedTweets = allTweets.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })

        setTweets(sortedTweets)
      } catch (error) {
        console.error('Error fetching tweets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTweets()
  }, [])

  const filteredTweets = useMemo(() => {
    if (!searchQuery.trim()) return tweets

    const query = searchQuery.toLowerCase()
    return tweets.filter(
      tweet =>
        tweet.content.toLowerCase().includes(query) ||
        tweet.author.toLowerCase().includes(query) ||
        tweet.handle.toLowerCase().includes(query)
    )
  }, [tweets, searchQuery])

  const displayedTweets = useMemo(() => {
    switch (selectedTab) {
      case 'popular':
        return [...filteredTweets].sort((a, b) => (b.likes || 0) - (a.likes || 0))
      case 'trending':
        return [...filteredTweets].slice(0, 5)
      default:
        return filteredTweets
    }
  }, [filteredTweets, selectedTab])

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold text-white/60">9:41</div>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <div className="w-4 h-4 text-xs">●●●●●</div>
              <div className="text-xs">📶</div>
              <div className="w-5 h-3 border border-white/40 rounded-sm" />
            </div>
          </div>

          {/* Location & Search Bar */}
          <div className="flex items-center justify-between gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white font-medium text-sm">
              <span className="text-lg">🌞</span>
              <span className="hidden sm:inline">Your Location</span>
              <span className="text-white/60 text-xs hidden sm:inline">▼</span>
            </button>

            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Search className="w-5 h-5 text-white/60" />
            </button>

            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white/60" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full" />
            </button>

            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <MessageSquare className="w-5 h-5 text-white/60" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
            </button>

            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-white/60" />
            </button>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm border border-emerald-400">
              Y
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Horizontal Scroll on Mobile */}
        <div className="border-t border-white/10 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-3 sm:px-6 sm:py-4">
            {navigationTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  selectedTab === tab.id
                    ? 'bg-white text-neutral-950'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Search Input */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                         text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 
                         focus:bg-white/[7%] transition-all"
            />
            <Search className="absolute right-3 top-3.5 w-5 h-5 text-white/40 pointer-events-none" />
          </div>

          {/* Tweets Feed */}
          <div className="space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white/60">Loading posts...</div>
              </div>
            ) : displayedTweets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Heart className="w-12 h-12 text-white/20 mb-3" />
                <p className="text-white/60 text-center">
                  {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to share!'}
                </p>
              </div>
            ) : (
              displayedTweets.map((tweet, idx) => (
                <div key={tweet.id} className={idx !== 0 ? 'border-t border-white/10' : ''}>
                  <TwitterPostFeed data={tweet} isDetailPage={false} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden sm:flex sm:flex-col gap-4 w-full sm:w-64 lg:w-80">
          {/* Quick Actions */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 
                           text-white/70 hover:text-white transition-all text-sm font-medium"
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              )
            })}
          </div>

          {/* Trending Section */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold text-sm mb-3">What's happening</h3>
            <div className="space-y-3">
              {[
                { category: 'Technology', trend: 'Next.js 15', posts: '2.4K' },
                { category: 'Web Dev', trend: 'React Hooks', posts: '1.8K' },
                { category: 'Trending', trend: 'Web Design', posts: '892' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all"
                >
                  <p className="text-white/50 text-xs">{item.category}</p>
                  <p className="text-white font-semibold text-sm">{item.trend}</p>
                  <p className="text-white/40 text-xs">{item.posts} posts</p>
                </button>
              ))}
            </div>
          </div>

          {/* Join Community */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-4 border border-emerald-500/20">
            <h3 className="text-white font-semibold text-sm mb-2">Join the conversation</h3>
            <p className="text-white/60 text-xs mb-4">Share your thoughts and connect with others</p>
            <Link href="/sign-up">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </aside>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Link href="/sign-up">
          <button className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 
                           text-white flex items-center justify-center shadow-lg">
            <span className="text-2xl">✏️</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
