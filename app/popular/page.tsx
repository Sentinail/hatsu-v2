'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AnimeGrid from '@/features/home/components/AnimeGrid'
import Providers from '@/service'
import Header from '@/components/header'

export default function PopularAnimePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get page from URL query or default to 1
  const currentPage = Number(searchParams.get('page') || '1')

  const [animeList, setAnimeList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  const perPage = 24 // Show more items per page

  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const anilist = Providers.ANILIST
        const data = await anilist.fetchPopularAnime({
          page: currentPage,
          perPage: perPage,
          isCached: true,
        })

        if (data?.data?.Page?.media) {
          setAnimeList(data.data.Page.media)
          // Estimate total pages - this is a rough estimate since the API doesn't return total count
          setTotalPages(Math.ceil(100 / perPage)) // Assuming around 100 items total
        } else {
          setAnimeList([])
          setError('No anime found')
        }
      } catch (err) {
        console.error('Error fetching popular anime:', err)
        setError('Failed to load anime. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnime()
    // Scroll to top when page changes
    window.scrollTo(0, 0)
  }, [currentPage, perPage])

  const handlePageChange = (page: number) => {
    // Create new URL with updated page parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/popular?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Popular Anime</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <span className="text-zinc-400 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>

        <AnimeGrid
          animeList={animeList}
          isLoading={isLoading}
          category="Popular"
        />

        {error && !isLoading && (
          <div className="text-center py-8 text-red-400">{error}</div>
        )}

        {/* Pagination - Bottom */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <span className="mx-4 text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
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
