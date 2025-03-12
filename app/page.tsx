'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Menu,
  X,
  Play,
  Search,
  Bell,
  Star,
  Calendar,
  ArrowRight,
  Gift,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Providers from '@/service'
import Header from '@/components/header'

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState('')
  const carouselRef = useRef<HTMLDivElement>(null)

  // State for API data
  const [popularAnime, setPopularAnime] = useState<any[]>([])
  const [trendingAnime, setTrendingAnime] = useState<any[]>([])
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState({
    popular: true,
    trending: true,
    upcoming: true,
  })

  // Gallery images for lightbox
  const galleryImages = [
    {
      id: 1,
      title: 'Epic Battle Scene',
      thumbnail: '/images/demon-slayer-kny.gif',
      fullsize: '/images/demon-slayer-kny.gif',
    },
    {
      id: 2,
      title: 'Emotional Moment',
      thumbnail: '/images/luffy-cry.gif',
      fullsize: '/images/luffy-cry.gif',
    },
    {
      id: 3,
      title: 'Character Transformation',
      thumbnail: '/images/little-little-space.gif',
      fullsize: '/images/little-little-space.gif',
    },
    {
      id: 4,
      title: 'Slice of Life',
      thumbnail: '/images/cries-horimiya.gif',
      fullsize: '/images/cries-horimiya.gif',
    },
    {
      id: 5,
      title: 'Villain Reveal',
      thumbnail: '/images/bleach-anime.gif',
      fullsize: '/images/bleach-anime.gif',
    },
    {
      id: 6,
      title: 'Fantasy World',
      thumbnail: '/images/megumin.gif',
      fullsize: '/images/megumin.gif',
    },
  ]

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Anime_Fan123',
      avatar: 'https://placehold.co/100x100/333/white?text=AF',
      comment:
        "Hatsu has the best streaming quality I've ever experienced. No buffering, and the library is massive!",
      rating: 5,
    },
    {
      id: 2,
      name: 'OtakuQueen',
      avatar: 'https://placehold.co/100x100/333/white?text=OQ',
      comment:
        'I love how they have all the latest releases. The UI is so easy to navigate too!',
      rating: 5,
    },
    {
      id: 3,
      name: 'MangaCollector',
      avatar: 'https://placehold.co/100x100/333/white?text=MC',
      comment:
        "The recommendation system is spot on. I've discovered so many hidden gems thanks to Hatsu.",
      rating: 4,
    },
  ]

  // Fetch data from Anilist API
  useEffect(() => {
    const fetchData = async () => {
      const anilist = Providers.ANILIST

      try {
        // Fetch popular anime for carousel
        const popularData = await anilist.fetchPopularAnime({
          perPage: 5,
          isCached: true,
        })
        if (popularData?.data?.Page?.media) {
          setPopularAnime(popularData.data.Page.media)
        }
        setIsLoading((prev) => ({ ...prev, popular: false }))

        // Fetch trending anime
        const trendingData = await anilist.fetchTrendingAnime({
          perPage: 5,
          isCached: true,
        })
        if (trendingData?.data?.Page?.media) {
          setTrendingAnime(trendingData.data.Page.media)
        }
        setIsLoading((prev) => ({ ...prev, trending: false }))

        // Fetch upcoming episodes
        const upcomingData = await anilist.fetchUpcomingEpisodes({
          perPage: 5,
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
          trending: false,
          upcoming: false,
        })
      }
    }

    fetchData()
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    if (popularAnime.length === 0) return

    const interval = setInterval(() => {
      setActiveSlide((prev) =>
        prev === popularAnime.length - 1 ? 0 : prev + 1
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [popularAnime.length])

  // Handle lightbox
  const openLightbox = (image: string) => {
    setLightboxImage(image)
    setLightboxOpen(true)
  }

  // Helper function to get color from anime
  const getColorFromAnime = (anime: any, index: number) => {
    const defaultColors = [
      'from-red-500',
      'from-amber-500',
      'from-blue-500',
      'from-purple-500',
    ]

    if (anime?.coverImage?.color) {
      return `from-[${anime.coverImage.color}]`
    }

    return defaultColors[index % defaultColors.length]
  }

  // Helper function to get placeholder image
  const getPlaceholderImage = (width: number, height: number, text = '') => {
    return `https://placehold.co/${width}x${height}/333/white?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-purple-600/30 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[10%] w-80 h-80 rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[15%] left-[15%] w-72 h-72 rounded-full bg-pink-600/20 blur-[100px]"></div>
      </div>

      {/* Navigation Bar */}
      <Header />

      <main className="relative z-10">
        {/* Hero Carousel */}
        <section className="relative h-[85vh] overflow-hidden">
          {isLoading.popular ? (
            <div className="h-full bg-zinc-900 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div ref={carouselRef} className="relative h-full">
              {popularAnime.map((anime, index) => (
                <div
                  key={anime.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === activeSlide
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${getColorFromAnime(anime, index)} via-black/60 to-transparent opacity-70 z-10`}
                  />

                  {/* Background image */}
                  <Image
                    src={
                      anime.bannerImage ||
                      getPlaceholderImage(
                        1200,
                        600,
                        anime.title?.userPreferred || 'Anime'
                      )
                    }
                    alt={
                      anime.title?.userPreferred ||
                      anime.title?.english ||
                      anime.title?.romaji ||
                      'Anime'
                    }
                    fill
                    className="object-cover"
                    priority={index === activeSlide}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-16 md:pb-24">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="max-w-2xl"
                    >
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {anime.genres?.slice(0, 3).map((genre: string) => (
                          <span
                            key={genre}
                            className="text-xs px-2 py-1 bg-purple-600/80 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                        {anime.averageScore && (
                          <span className="text-xs px-2 py-1 bg-zinc-700/80 rounded-full flex items-center">
                            <Star
                              size={12}
                              className="text-yellow-400 mr-1"
                              fill="currentColor"
                            />
                            {(anime.averageScore / 10).toFixed(1)}
                          </span>
                        )}
                      </div>

                      <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">
                        {anime.title?.userPreferred ||
                          anime.title?.english ||
                          anime.title?.romaji}
                      </h1>

                      <p className="text-lg md:text-xl mb-6 drop-shadow-md line-clamp-3">
                        {anime.description?.replace(/<[^>]*>/g, '') ||
                          'No description available.'}
                      </p>

                      <div className="flex gap-4">
                        <Link href={`/anime/${anime.id}`}>
                          <Button
                            size="lg"
                            className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
                          >
                            <Play size={16} className="mr-2" /> Watch Now
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button
                            size="lg"
                            variant="outline"
                            className="text-black border-white/70 hover:cursor-pointer"
                          >
                            Sign Up Free
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Carousel indicators */}
          {!isLoading.popular && popularAnime.length > 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {popularAnime.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`hover:cursor-pointer w-2 h-2 rounded-full transition-all ${
                    index === activeSlide ? 'w-6 bg-purple-500' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Stats Banner */}
        <section className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-y border-purple-500/20">
          <div className="container mx-auto py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
                  10,000+
                </div>
                <div className="text-sm text-zinc-300">Anime Episodes</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
                  1,500+
                </div>
                <div className="text-sm text-zinc-300">Anime Series</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
                  50+
                </div>
                <div className="text-sm text-zinc-300">New Episodes Daily</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">
                  1M+
                </div>
                <div className="text-sm text-zinc-300">Happy Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gradient-to-b from-black to-zinc-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Discover Hatsu Features
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 - Animated Image */}
              <div className="bg-zinc-800/50 rounded-lg p-5 border border-zinc-700 hover:border-purple-500/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group">
                <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent z-10" />
                  <Image
                    src={
                      popularAnime[0]?.bannerImage ||
                      getPlaceholderImage(500, 300, 'Stream Anywhere')
                    }
                    alt="Stream Anywhere"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  Stream Anywhere
                </h3>
                <p className="text-zinc-400 text-sm">
                  Watch your favorite anime on any device, anytime, anywhere.
                  Our platform is optimized for mobile, tablet, and desktop
                  viewing.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-400">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> HD Quality
                    Streaming
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> Download for
                    Offline Viewing
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> Cross-device
                    Sync
                  </li>
                </ul>
              </div>

              {/* Feature 2 - Animated Image */}
              <div className="bg-zinc-800/50 rounded-lg p-5 border border-zinc-700 hover:border-purple-500/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group">
                <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent z-10" />
                  <Image
                    src={
                      trendingAnime[0]?.bannerImage ||
                      getPlaceholderImage(500, 300, 'HD Quality')
                    }
                    alt="HD Quality"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  HD Quality
                </h3>
                <p className="text-zinc-400 text-sm">
                  Enjoy crystal clear HD streaming with no interruptions.
                  Experience anime the way it was meant to be seen.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-400">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> 1080p Full HD
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> 4K Support
                    for Select Titles
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> Adaptive
                    Streaming
                  </li>
                </ul>
              </div>

              {/* Feature 3 - Animated Image */}
              <div className="bg-zinc-800/50 rounded-lg p-5 border border-zinc-700 hover:border-purple-500/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group">
                <div className="relative h-40 mb-4 overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent z-10" />
                  <Image
                    src={
                      upcomingEpisodes[0]?.media?.coverImage?.large ||
                      getPlaceholderImage(500, 300, 'New Releases')
                    }
                    alt="New Releases"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  New Releases
                </h3>
                <p className="text-zinc-400 text-sm">
                  Stay updated with the latest anime releases and episodes. New
                  content added daily from Japan.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-400">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> Simulcast
                    with Japan
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> Release
                    Notifications
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span> Seasonal
                    Previews
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="py-10 bg-zinc-900 relative">
          <div className="absolute inset-0 bg-[url('https://placehold.co/1200x800/333/white?text=Background')] bg-cover bg-center opacity-10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <Link
                href="/trending"
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
              >
                View All <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            {isLoading.trending ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-zinc-800/60 rounded-lg overflow-hidden border border-zinc-700 animate-pulse"
                  >
                    <div className="relative aspect-[2/3] bg-zinc-700"></div>
                    <div className="p-3">
                      <div className="h-4 bg-zinc-700 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {trendingAnime.slice(0, 4).map((anime) => (
                  <Link
                    href={`/anime/${anime.id}`}
                    key={anime.id}
                    className="group"
                  >
                    <div className="bg-zinc-800/60 rounded-lg overflow-hidden border border-zinc-700 hover:border-purple-500/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image
                          src={
                            anime.coverImage?.extraLarge ||
                            anime.coverImage?.large ||
                            anime.coverImage?.medium ||
                            getPlaceholderImage(
                              300,
                              450,
                              anime.title?.userPreferred || 'Anime'
                            )
                          }
                          alt={
                            anime.title?.userPreferred ||
                            anime.title?.english ||
                            anime.title?.romaji ||
                            'Anime'
                          }
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {anime.averageScore && (
                          <div className="absolute top-2 right-2 bg-black/70 px-1.5 py-0.5 rounded flex items-center text-xs">
                            <Star
                              size={12}
                              className="text-yellow-400 mr-1"
                              fill="currentColor"
                            />
                            {(anime.averageScore / 10).toFixed(1)}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20"></div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                          {anime.title?.userPreferred ||
                            anime.title?.english ||
                            anime.title?.romaji}
                        </h3>
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>{anime.genres?.[0] || 'Anime'}</span>
                          <span>
                            {anime.episodes
                              ? `${anime.episodes} Episodes`
                              : 'Ongoing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Image Map Section */}
        <section className="py-10 bg-black relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-50"></div>
          <div className="container mx-auto px-4 relative">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Explore Anime Genres
            </h2>

            <div className="relative w-full max-w-4xl mx-auto h-[300px] md:h-[400px] border-4 border-zinc-800 rounded-lg overflow-hidden">
              <Image
                src="/images/all-anime-wallpaper.png"
                alt="Anime Genres Map"
                fill
                className="object-cover"
                useMap="#genreMap"
              />

              <map name="genreMap">
                <area
                  shape="rect"
                  coords="0,0,400,200"
                  alt="Action"
                  href="/search?genre=Action"
                  title="Action Anime"
                />
                <area
                  shape="rect"
                  coords="401,0,800,200"
                  alt="Romance"
                  href="/search?genre=Romance"
                  title="Romance Anime"
                />
                <area
                  shape="rect"
                  coords="0,201,400,400"
                  alt="Fantasy"
                  href="/search?genre=Fantasy"
                  title="Fantasy Anime"
                />
                <area
                  shape="rect"
                  coords="401,201,800,400"
                  alt="Sci-Fi"
                  href="/search?genre=Sci-Fi"
                  title="Sci-Fi Anime"
                />
              </map>

              {/* Overlay text for better UX */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                <div className="flex items-center justify-center bg-black/50 hover:bg-purple-900/50 transition-colors">
                  <span className="text-2xl font-bold">Action</span>
                </div>
                <div className="flex items-center justify-center bg-black/50 hover:bg-purple-900/50 transition-colors">
                  <span className="text-2xl font-bold">Romance</span>
                </div>
                <div className="flex items-center justify-center bg-black/50 hover:bg-purple-900/50 transition-colors">
                  <span className="text-2xl font-bold">Fantasy</span>
                </div>
                <div className="flex items-center justify-center bg-black/50 hover:bg-purple-900/50 transition-colors">
                  <span className="text-2xl font-bold">Sci-Fi</span>
                </div>
              </div>
            </div>

            {/* Genre quick links */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                'Action',
                'Romance',
                'Comedy',
                'Horror',
                'Isekai',
                'Mecha',
                'Sports',
                'Mystery',
              ].map((genre) => (
                <Link
                  href={`/search?genre=${genre.toLowerCase().replace(/\s+/g, '-')}`}
                  key={genre}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-black hover:text-white hover:cursor-pointer border-zinc-700 hover:border-purple-500 hover:bg-purple-900/20"
                  >
                    {genre}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Releases */}
        <section className="py-10 bg-zinc-900">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Episodes</h2>
              <Link
                href="/schedule"
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
              >
                Full Schedule <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            {isLoading.upcoming ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-zinc-800/60 rounded-lg overflow-hidden border border-zinc-700 animate-pulse"
                  >
                    <div className="relative h-32 bg-zinc-700"></div>
                    <div className="p-3">
                      <div className="h-4 bg-zinc-700 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEpisodes.slice(0, 3).map((schedule) => {
                  const anime = schedule.media
                  const airingTime = new Date(schedule.airingAt * 1000)
                  const timeUntil = schedule.timeUntilAiring
                  const countdown =
                    timeUntil > 86400
                      ? `${Math.floor(timeUntil / 86400)} days`
                      : `${Math.floor(timeUntil / 3600)} hours`

                  return (
                    <div
                      key={`${anime.id}-${schedule.episode}`}
                      className="bg-zinc-800/60 rounded-lg overflow-hidden border border-zinc-700 hover:border-purple-500/50 transition-all group"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={
                            anime.coverImage?.extraLarge ||
                            anime.coverImage?.large ||
                            anime.coverImage?.medium ||
                            getPlaceholderImage(
                              250,
                              150,
                              anime.title?.userPreferred || 'Anime'
                            )
                          }
                          alt={
                            anime.title?.userPreferred ||
                            anime.title?.english ||
                            anime.title?.romaji ||
                            'Anime'
                          }
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div className="absolute bottom-2 right-2 bg-purple-600 text-xs px-2 py-0.5 rounded-full">
                          {countdown}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 group-hover:text-purple-400 transition-colors">
                          {anime.title?.userPreferred ||
                            anime.title?.english ||
                            anime.title?.romaji}
                        </h3>
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                          <span>Episode {schedule.episode}</span>
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {airingTime.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Table Section */}
        <section className="py-10 bg-black relative">
          <div className="absolute inset-0 bg-[url('https://placehold.co/1200x800/333/white?text=Background')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Top Anime This Season
            </h2>

            <div className="overflow-x-auto rounded-lg border border-zinc-800 shadow-lg">
              {isLoading.trending ? (
                <div className="bg-zinc-900 p-8 text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400">Loading top anime...</p>
                </div>
              ) : trendingAnime.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="py-3 px-4 text-left">Rank</th>
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Genre</th>
                      <th className="py-3 px-4 text-left">Rating</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {trendingAnime
                      .sort((a, b) => b.averageScore - a.averageScore)
                      .map((anime, index) => (
                        <tr
                          key={anime.id}
                          className="bg-zinc-900 hover:bg-zinc-800 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium">{index + 1}</td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/anime/${anime.id}`}
                              className="hover:text-purple-400 transition-colors"
                            >
                              {anime.title?.userPreferred ||
                                anime.title?.english ||
                                anime.title?.romaji}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            {anime.genres?.slice(0, 2).join(', ') || 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span>
                                {anime.averageScore
                                  ? (anime.averageScore / 10).toFixed(1)
                                  : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 ${
                                anime.status === 'RELEASING'
                                  ? 'bg-green-500/20 text-green-400'
                                  : anime.status === 'FINISHED'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-amber-500/20 text-amber-400'
                              } rounded-full text-xs`}
                            >
                              {anime.status === 'RELEASING'
                                ? 'Airing'
                                : anime.status === 'FINISHED'
                                  ? 'Completed'
                                  : anime.status || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="bg-zinc-900 p-8 text-center text-zinc-400">
                  No trending anime data available.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-10 bg-zinc-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              What Our Users Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-zinc-800/60 rounded-lg p-5 border border-zinc-700"
                >
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                      <Image
                        src={testimonial.avatar || 'https://placehold.co/100x100/333/white?text=Avatar'}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill="currentColor"
                            className={
                              i >= testimonial.rating ? 'text-zinc-600' : ''
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm italic">
                    "{testimonial.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Gallery with Lightbox */}
        <section className="py-10 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Anime Gallery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => openLightbox(image.fullsize)}
                >
                  <Image
                    src={image.thumbnail || 'https://placehold.co/300x200/333/white?text=Image'}
                    alt={image.title}
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {image.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent className="bg-black/90 border-zinc-800 max-w-4xl p-1">
                <div className="relative aspect-video">
                  <Image
                    src={lightboxImage || 'https://placehold.co/1200x800/333/white?text=Image'}
                    alt="Enlarged anime image"
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-10 bg-zinc-900 relative">
          <div className="absolute inset-0 bg-[url('/images/hatsune_miku_vocaloid_wallpaper.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Form on the left */}
              <div className="bg-zinc-900/90 p-6 rounded-lg border border-zinc-700 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
                <p className="text-zinc-400 text-sm mb-6">
                  Get weekly updates on new releases, exclusive content, and
                  special offers.
                </p>

                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="interests"
                      className="block text-sm font-medium mb-1"
                    >
                      Favorite Genres
                    </label>
                    <select
                      id="interests"
                      multiple
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="action">Action</option>
                      <option value="adventure">Adventure</option>
                      <option value="comedy">Comedy</option>
                      <option value="drama">Drama</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="horror">Horror</option>
                      <option value="romance">Romance</option>
                      <option value="sci-fi">Sci-Fi</option>
                    </select>
                    <p className="text-xs text-zinc-500 mt-1">
                      Hold Ctrl/Cmd to select multiple
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 rounded border-zinc-700 text-purple-600 focus:ring-purple-500 bg-zinc-800"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-zinc-400"
                    >
                      I agree to receive emails about cool anime stuff
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>

              {/* Content on the right */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Stay Updated
                </h2>
                <p className="text-lg text-zinc-300 mb-6">
                  Never miss a new release or special event. Our newsletter
                  subscribers get:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-purple-600/20 p-2 rounded-full mr-3 mt-1">
                      <Star className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Early Access</h3>
                      <p className="text-zinc-400 text-sm">
                        Be the first to know about new anime releases and
                        episodes
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-600/20 p-2 rounded-full mr-3 mt-1">
                      <Calendar className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Exclusive Events</h3>
                      <p className="text-zinc-400 text-sm">
                        Get invites to special streaming events and watch
                        parties
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-600/20 p-2 rounded-full mr-3 mt-1">
                      <Gift className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Special Offers</h3>
                      <p className="text-zinc-400 text-sm">
                        Receive exclusive discounts and promotional offers
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-b from-zinc-900 to-black relative">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Anime Journey?
            </h2>
            <p className="text-lg text-zinc-400 mb-6 max-w-2xl mx-auto">
              Join thousands of anime fans and start streaming your favorite
              shows today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/home">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
                >
                  <Play size={16} className="mr-2" /> Start Watching
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-white/70 hover:cursor-pointer"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple-500 mb-4">Hatsu</h3>
              <p className="text-zinc-400 text-sm">
                Your ultimate destination for anime streaming. Watch the latest
                episodes, discover new series, and join a community of anime
                lovers.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM8.252 15.296V8.704l6.615 3.296-6.615 3.296z"></path>
                  </svg>
                </a>
              </div>
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
                  <Link href="/sitemap/sitemap.xml" className="hover:text-purple-400">
                    Sitemap
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
            <p>© {new Date().getFullYear()} Hatsu. All rights reserved. Developed by Wilson Ponseca.
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

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="bg-black/90 border-zinc-800 max-w-4xl p-1">
          <div className="relative aspect-video">
            <Image
              src={lightboxImage || 'https://placehold.co/1200x800/333/white?text=Image'}
              alt="Enlarged anime image"
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
