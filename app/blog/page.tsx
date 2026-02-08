"use client"

import { useEffect, useState } from "react"
import { Search, Menu, Bell, MessageCircle, TrendingUp } from "lucide-react"
import AnimatedHeading from "@/components/animated-heading"
import { BlogTweetSection } from "@/components/blog-tweet-section"

export default function BlogPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("latest")

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = ["Latest", "Popular", "Dev Updates", "Experiments", "Insights"]

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* iOS-style header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/95 backdrop-blur-md">
        {/* Status bar simulation */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-white/60 border-b border-white/5">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-white/40 rounded-[2px]" />
          </div>
        </div>

        {/* Header content */}
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-black">Dev Log</h1>
              <p className="text-xs text-white/50">Building in public</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 text-sm placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category.toLowerCase())}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-all ${
                activeCategory === category.toLowerCase()
                  ? "bg-white text-neutral-950"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* Hero section */}
        {!searchQuery && (
          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-black">Welcome to my Dev Log</h2>
                <p className="text-white/60 text-sm mt-2">
                  I share thoughts, progress updates, and experiments from building in public. Feel free to engage!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Blog tweets section */}
        <BlogTweetSection />

        {/* Trending section */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              <h3 className="font-semibold">Trending Topics</h3>
            </div>
            <div className="space-y-3">
              {[
                { tag: "#WebDevelopment", posts: 234 },
                { tag: "#BuildInPublic", posts: 189 },
                { tag: "#DevJourney", posts: 156 },
                { tag: "#NextJS", posts: 142 }
              ].map((trend) => (
                <button
                  key={trend.tag}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="font-medium text-sm">{trend.tag}</div>
                  <div className="text-xs text-white/50">{trend.posts} posts</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom navigation (mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-neutral-950/95 backdrop-blur-md px-4 py-3 flex items-center justify-around">
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <MessageCircle size={24} />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <TrendingUp size={24} />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Bell size={24} />
        </button>
      </div>

      {/* Padding for mobile bottom nav */}
      <div className="lg:hidden h-20" />
    </main>
  )
}

