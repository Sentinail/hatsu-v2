'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import sanitizeHtml from 'sanitize-html'
import Link from 'next/link'

interface AnimeCarouselProps {
  animeList: any[]
  isLoading?: boolean
}

export default function AnimeCarousel({
  animeList = [],
  isLoading = false,
}: AnimeCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === animeList.length - 1 ? 0 : prev + 1))
  }, [animeList.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? animeList.length - 1 : prev - 1))
  }

  // Auto slide every 6 seconds
  useEffect(() => {
    if (isLoading || animeList.length === 0) return

    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide, isLoading, animeList.length])

  if (isLoading) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-zinc-900">
        {/* Skeleton loader */}
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
          <div className="bg-zinc-800 h-full w-full" />

          {/* Content skeleton */}
          <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-16 md:pb-24">
            <div className="max-w-2xl">
              <div className="flex gap-2 mb-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-16 bg-zinc-700 rounded-full" />
                ))}
              </div>

              <div className="h-10 w-3/4 bg-zinc-700 mb-3 rounded-md" />
              <div className="h-4 w-full bg-zinc-700 mb-2 rounded-md" />
              <div className="h-4 w-full bg-zinc-700 mb-2 rounded-md" />
              <div className="h-4 w-2/3 bg-zinc-700 mb-6 rounded-md" />

              <div className="flex gap-4">
                <div className="h-10 w-32 bg-zinc-700 rounded-md" />
                <div className="h-10 w-32 bg-zinc-700 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons skeleton */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 w-10 h-10" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 w-10 h-10" />

        {/* Indicators skeleton */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/50" />
          ))}
        </div>
      </div>
    )
  }

  if (animeList.length === 0) {
    return null
  }

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Carousel slides */}
      <div className="relative h-full">
        {animeList.map((anime, index) => (
          <div
            key={anime.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

            {/* Background image */}
            <Image
              src={anime.bannerImage || 'https://placehold.co/600x1200'}
              alt={
                anime.title.userPreferred ||
                anime.title.english ||
                anime.title.romaji
              }
              fill
              className="object-cover"
              priority={index === currentSlide}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-16 md:pb-24">
              <div className="max-w-2xl">
                <div className="flex gap-2 mb-3">
                  {anime.genres.slice(0, 3).map((genre: string) => (
                    <span
                      key={genre}
                      className="text-xs px-2 py-1 bg-purple-600/80 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                  {anime.season && (
                    <span className="text-xs px-2 py-1 bg-zinc-700/80 rounded-full">
                      {anime.season}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                  {anime.title.userPreferred ||
                    anime.title.english ||
                    anime.title.romaji}
                </h1>

                <p
                  className="text-zinc-300 mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html:
                      sanitizeHtml(anime.description) ||
                      'No description available.',
                  }}
                />

                <div className="flex gap-4">
                  <Link href={`/anime/${anime.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer">
                      <Play size={16} className="mr-2" /> Watch Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-black hover:cursor-pointer"
                  >
                    + Add to List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {animeList.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-6 bg-purple-500' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
