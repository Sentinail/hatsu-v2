'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Bell, Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AnimeCarousel from '@/features/home/components/AnimeCarousel'
import AnimeGrid from '@/features/home/components/AnimeGrid'
import UpcomingEpisodes from '@/features/home/components/UpcomingEpisodes'
import Providers from '@/service'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Header from '@/components/header'

export default function Home() {
  const [popularAnime, setPopularAnime] = useState([])
  const [latestAnime, setLatestAnime] = useState([])
  const [trendingAnime, setTrendingAnime] = useState([])
  const [upcomingEpisodes, setUpcomingEpisodes] = useState([])
  const [isLoading, setIsLoading] = useState({
    popular: true,
    latest: true,
    trending: true,
    upcoming: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      const anilist = Providers.ANILIST

      try {
        // Fetch popular anime for carousel
        const popularData = await anilist.fetchPopularAnime({ isCached: true })
        if (popularData?.data?.Page?.media) {
          setPopularAnime(popularData.data.Page.media)
        }
        setIsLoading((prev) => ({ ...prev, popular: false }))

        // Fetch latest releases
        const latestData = await anilist.fetchLatestReleaseAnime({
          isCached: true,
        })
        if (latestData?.data?.Page?.media) {
          setLatestAnime(latestData.data.Page.media)
        }
        setIsLoading((prev) => ({ ...prev, latest: false }))

        // Fetch trending anime
        const trendingData = await anilist.fetchTrendingAnime({
          isCached: true,
        })
        if (trendingData?.data?.Page?.media) {
          setTrendingAnime(trendingData.data.Page.media)
        }
        setIsLoading((prev) => ({ ...prev, trending: false }))

        // Fetch upcoming episodes
        const upcomingData = await anilist.fetchUpcomingEpisodes({
          isCached: true,
        })
        if (upcomingData?.data?.Page?.airingSchedules) {
          setUpcomingEpisodes(upcomingData.data.Page.airingSchedules)
        }
        setIsLoading((prev) => ({ ...prev, upcoming: false }))
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading({
          popular: false,
          latest: false,
          trending: false,
          upcoming: false,
        })
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Hero Section - Carousel */}
        <section className="w-full">
          <AnimeCarousel
            animeList={popularAnime}
            isLoading={isLoading.popular}
          />
        </section>

        {/* Latest Releases Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Releases</h2>
            <Link
              href="/latest"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View All
            </Link>
          </div>
          <AnimeGrid
            animeList={latestAnime}
            isLoading={isLoading.latest}
            category="LATEST"
          />
        </section>

        {/* Trending Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <Link
              href="/trending"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View All
            </Link>
          </div>
          <AnimeGrid
            animeList={trendingAnime}
            isLoading={isLoading.trending}
            category="TRENDING"
          />
        </section>

        {/* Upcoming Episodes */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Episodes</h2>
            <Link
              href="/schedule"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Full Schedule
            </Link>
          </div>
          <UpcomingEpisodes
            episodeList={upcomingEpisodes}
            isLoading={isLoading.upcoming}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple-500 mb-4">Hatsu</h3>
              <p className="text-zinc-400 text-sm">
                Your ultimate destination for anime streaming. Watch the latest
                episodes, discover new series, and join a community of anime
                lovers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>
                  <Link href="/home" className="hover:text-purple-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-purple-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-purple-400">
                    Search
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-purple-400">
                    Hatsu
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>
                  <Link href="/login" className="hover:text-purple-400">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-purple-400">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-purple-400">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-purple-400">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-purple-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-purple-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="hover:text-purple-400">
                    DMCA
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-purple-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
            <p>
              © {new Date().getFullYear()} Hatsu. All rights reserved.
              Developed
              <Link
                href="/sitemap/sitemap.xml"
                className="text-purple-400 hover:text-purple-300 ml-2"
              >
                Sitemap
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
