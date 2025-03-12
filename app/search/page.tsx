'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  X,
  Star,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Clock,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import Providers from '@/service'
import Header from '@/components/header'

// Available genres for filtering
const ANIME_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
]

// Available statuses for filtering
const ANIME_STATUSES = [
  { value: 'RELEASING', label: 'Airing' },
  { value: 'FINISHED', label: 'Completed' },
  { value: 'NOT_YET_RELEASED', label: 'Upcoming' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'HIATUS', label: 'On Hiatus' },
]

// Available sort options
const SORT_OPTIONS = [
  { value: 'POPULARITY_DESC', label: 'Popularity' },
  { value: 'SCORE_DESC', label: 'Rating' },
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'START_DATE_DESC', label: 'Newest' },
  { value: 'FAVOURITES_DESC', label: 'Most Favorited' },
  { value: 'TITLE_ROMAJI', label: 'Title (A-Z)' },
  { value: 'TITLE_ROMAJI_DESC', label: 'Title (Z-A)' },
]

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get search parameters from URL
  const query = searchParams.get('q') || ''
  const page = Number.parseInt(searchParams.get('page') || '1')
  const sort = searchParams.get('sort') || 'POPULARITY_DESC'
  const status = searchParams.get('status') || ''
  const genre = searchParams.get('genre') || ''

  const [searchQuery, setSearchQuery] = useState(query)
  const [searchResults, setSearchResults] = useState<any>({
    media: [],
    pageInfo: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch search results when URL parameters change
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const anilist = Providers.ANILIST

        // Prepare filter parameters
        const statusFilter = status ? [status] : []
        const genreFilter = genre ? [genre] : []

        const data = await anilist.searchAnime({
          search: query,
          page: page,
          perPage: 24,
          sort: sort,
          statusIn: statusFilter,
          genreIn: genreFilter,
          isCached: true,
        })

        if (data?.data?.Page) {
          setSearchResults({
            media: data.data.Page.media || [],
            pageInfo: data.data.Page.pageInfo || null,
          })
        } else {
          setSearchResults({ media: [], pageInfo: null })
        }
      } catch (err) {
        console.error('Error searching anime:', err)
        setError('Failed to search anime. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, page, sort, status, genre])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL with search parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (sort !== 'POPULARITY_DESC') params.set('sort', sort)
    if (status) params.set('status', status)
    if (genre) params.set('genre', genre)
    params.set('page', '1') // Reset to page 1 on new search

    router.push(`/search?${params.toString()}`)
  }

  const updateFilters = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      if (value.startsWith('ANY')) {
        params.delete(type)
      } else {
        params.set(type, value)
      }
    } else {
      params.delete(type)
    }

    // Reset to page 1 when filters change
    params.set('page', '1')

    router.push(`/search?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/search?${params.toString()}`)
  }

  // Helper function to get placeholder image
  const getPlaceholderImage = (width: number, height: number, text = '') => {
    return `https://placehold.co/${width}x${height}/333/white?text=${encodeURIComponent(text)}`
  }

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'RELEASING':
        return 'Airing'
      case 'FINISHED':
        return 'Completed'
      case 'NOT_YET_RELEASED':
        return 'Upcoming'
      case 'CANCELLED':
        return 'Cancelled'
      case 'HIATUS':
        return 'On Hiatus'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Advanced Search</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search for anime titles, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 bg-zinc-900 border-zinc-800 focus-visible:ring-purple-500 text-lg"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer py-6 px-8"
              >
                Search
              </Button>
              <Button
                type="button"
                className="border-zinc-700 hover:bg-zinc-800 hover:cursor-pointer py-6"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-400">
                      Sort By
                    </label>
                    <Select
                      value={sort}
                      onValueChange={(value) => updateFilters('sort', value)}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-400">
                      Status
                    </label>
                    <Select
                      value={status}
                      onValueChange={(value) => updateFilters('status', value)}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="ANY">Any status</SelectItem>
                        {ANIME_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-400">
                      Genre
                    </label>
                    <Select
                      value={genre}
                      onValueChange={(value) => updateFilters('genre', value)}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Any genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[300px]">
                        <SelectItem value="ANY">Any genre</SelectItem>
                        {ANIME_GENRES.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters */}
                {(status || genre || sort !== 'POPULARITY_DESC') && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-zinc-400">
                        Active filters:
                      </span>

                      {status && (
                        <Badge
                          className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:cursor-pointer"
                          onClick={() => updateFilters('status', '')}
                        >
                          Status:{' '}
                          {ANIME_STATUSES.find((s) => s.value === status)
                            ?.label || status}
                          <X size={14} className="ml-1" />
                        </Badge>
                      )}

                      {genre && (
                        <Badge
                          className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:cursor-pointer"
                          onClick={() => updateFilters('genre', '')}
                        >
                          Genre: {genre}
                          <X size={14} className="ml-1" />
                        </Badge>
                      )}

                      {sort !== 'POPULARITY_DESC' && (
                        <Badge
                          className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 hover:cursor-pointer"
                          onClick={() =>
                            updateFilters('sort', 'POPULARITY_DESC')
                          }
                        >
                          Sort:{' '}
                          {SORT_OPTIONS.find((s) => s.value === sort)?.label ||
                            sort}
                          <X size={14} className="ml-1" />
                        </Badge>
                      )}

                      <Button
                        variant="link"
                        className="text-xs text-zinc-400 hover:text-purple-400 p-0 h-auto hover:cursor-pointer"
                        onClick={() => {
                          const params = new URLSearchParams()
                          if (query) params.set('q', query)
                          params.set('page', '1')
                          router.push(`/search?${params.toString()}`)
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Search Results */}
          {isLoading && searchResults.media.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2
                size={40}
                className="text-purple-500 animate-spin mb-4"
              />
              <p className="text-zinc-400">Searching for anime...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-red-900/50 hover:bg-red-900/20 hover:cursor-pointer"
                onClick={() => setError(null)}
              >
                Try Again
              </Button>
            </div>
          ) : searchResults.media.length === 0 && query ? (
            <div className="text-center py-12">
              <p className="text-xl font-semibold mb-2">No results found</p>
              <p className="text-zinc-400 mb-4">
                We couldn't find any anime matching "{query}"
              </p>
              <p className="text-zinc-500 text-sm">
                Try using different keywords or adjusting your filters
              </p>
            </div>
          ) : searchResults.media.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Search Results
                  {searchResults.pageInfo?.total && (
                    <span className="text-zinc-400 text-base ml-2">
                      ({searchResults.pageInfo.total} found)
                    </span>
                  )}
                </h2>
                <div className="text-sm text-zinc-400">
                  Page {searchResults.pageInfo?.currentPage || 1}
                  {searchResults.pageInfo?.lastPage &&
                    ` of ${searchResults.pageInfo.lastPage}`}
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.media.map((anime: any) => (
                  <div
                    key={anime.id}
                    className="bg-zinc-900/60 rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-colors group"
                  >
                    <Link href={`/anime/${anime.id}`} className="block">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={
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
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
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

                        {/* Status Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge
                            className={`
                              ${
                                anime.status === 'RELEASING'
                                  ? 'bg-green-600/80'
                                  : anime.status === 'FINISHED'
                                    ? 'bg-blue-600/80'
                                    : anime.status === 'NOT_YET_RELEASED'
                                      ? 'bg-amber-600/80'
                                      : 'bg-zinc-600/80'
                              }
                            `}
                          >
                            {formatStatus(anime.status)}
                          </Badge>
                        </div>
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link href={`/anime/${anime.id}`} className="block">
                        <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                          {anime.title?.userPreferred ||
                            anime.title?.english ||
                            anime.title?.romaji}
                        </h3>
                      </Link>

                      <div className="flex justify-between items-center text-sm text-zinc-400 mb-2">
                        <span>{anime.format || 'TV'}</span>
                        <span>
                          {anime.seasonYear || ''} {anime.season || ''}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {anime.genres?.slice(0, 3).map((genre: string) => (
                          <span
                            key={genre}
                            className="text-xs px-1.5 py-0.5 bg-zinc-800 rounded-full cursor-pointer hover:bg-purple-600/30"
                            onClick={(e) => {
                              e.preventDefault()
                              updateFilters('genre', genre)
                            }}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value="description"
                          className="border-zinc-800"
                        >
                          <AccordionTrigger className="text-xs text-zinc-400 hover:text-purple-400 py-2">
                            Show description
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs text-zinc-300 line-clamp-4">
                              {anime.description?.replace(/<[^>]*>/g, '') ||
                                'No description available.'}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                <span>{anime.episodes || '?'} eps</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Episodes</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                <span>{anime.duration || '?'} min</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Duration per episode</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <Link
                          href={`/anime/${anime.id}`}
                          className="text-purple-400 hover:text-purple-300 flex items-center"
                        >
                          <Info size={12} className="mr-1" />
                          <span>Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {searchResults.pageInfo && (
                <div className="mt-12 flex justify-center items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="border-zinc-700 hover:bg-zinc-800 hover:cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                      <span className="sr-only">Previous Page</span>
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        {
                          length: Math.min(
                            5,
                            searchResults.pageInfo.lastPage || 1
                          ),
                        },
                        (_, i) => {
                          // Calculate which page numbers to show
                          let pageNum
                          if (searchResults.pageInfo.lastPage <= 5) {
                            pageNum = i + 1
                          } else if (page <= 3) {
                            pageNum = i + 1
                          } else if (
                            page >=
                            searchResults.pageInfo.lastPage - 2
                          ) {
                            pageNum = searchResults.pageInfo.lastPage - 4 + i
                          } else {
                            pageNum = page - 2 + i
                          }

                          return (
                            <Button
                              key={i}
                              variant={pageNum === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-9 ${
                                pageNum === page
                                  ? 'bg-purple-600 hover:bg-purple-700'
                                  : 'border-zinc-700 hover:bg-zinc-800'
                              } hover:cursor-pointer`}
                            >
                              {pageNum}
                            </Button>
                          )
                        }
                      )}

                      {searchResults.pageInfo.lastPage > 5 &&
                        page < searchResults.pageInfo.lastPage - 2 && (
                          <>
                            <span className="text-zinc-500">...</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePageChange(
                                  searchResults.pageInfo.lastPage
                                )
                              }
                              className="w-9 border-zinc-700 hover:bg-zinc-800 hover:cursor-pointer"
                            >
                              {searchResults.pageInfo.lastPage}
                            </Button>
                          </>
                        )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!searchResults.pageInfo.hasNextPage}
                      className="border-zinc-700 hover:bg-zinc-800 hover:cursor-pointer"
                    >
                      <ChevronRight size={16} />
                      <span className="sr-only">Next Page</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Initial state - no search yet
            <div className="text-center py-16 max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Search size={40} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Advanced Anime Search</h2>
              <p className="text-zinc-400 mb-8">
                Find exactly what you're looking for with our powerful search
                filters
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                  <h3 className="font-medium mb-1">Search Tips</h3>
                  <p className="text-xs text-zinc-500">
                    Try searching by title, genre, or season. Use filters to
                    narrow down results.
                  </p>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                  <h3 className="font-medium mb-1">Popular Genres</h3>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {[
                      'Action',
                      'Romance',
                      'Comedy',
                      'Fantasy',
                      'Slice of Life',
                    ].map((genre) => (
                      <Badge
                        key={genre}
                        className="bg-zinc-800 hover:bg-purple-600/30 cursor-pointer"
                        onClick={() => updateFilters('genre', genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>
            © {new Date().getFullYear()} Hatsu. All rights reserved. Developed
            by Wilson Ponseca.
            <Link
              href="/sitemap/sitemap.xml"
              className="text-purple-400 hover:text-purple-300 ml-2"
            >
              Sitemap
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
