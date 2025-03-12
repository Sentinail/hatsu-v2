"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, Home, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import UpcomingEpisodes from "@/features/home/components/UpcomingEpisodes"
import Providers from "@/service"

export default function SchedulePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get page from URL query or default to 1
  const currentPage = Number(searchParams.get("page") || "1")

  const [episodeList, setEpisodeList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  const perPage = 12 // Show more items per page

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const anilist = Providers.ANILIST
        const data = await anilist.fetchUpcomingEpisodes({
          page: currentPage,
          perPage: perPage,
          isCached: true,
        })

        if (data?.data?.Page?.airingSchedules) {
          setEpisodeList(data.data.Page.airingSchedules)
          // Estimate total pages - this is a rough estimate since the API doesn't return total count
          setTotalPages(Math.ceil(50 / perPage)) // Assuming around 50 items total
        } else {
          setEpisodeList([])
          setError("No upcoming episodes found")
        }
      } catch (err) {
        console.error("Error fetching schedule:", err)
        setError("Failed to load schedule. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedule()
    // Scroll to top when page changes
    window.scrollTo(0, 0)
  }, [currentPage, perPage])

  const handlePageChange = (page: number) => {
    // Create new URL with updated page parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/schedule?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-500">
            Hatsu
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search" className="p-2 text-zinc-400 hover:text-white transition">
              <Search size={20} />
            </Link>
            <Link href="/home">
              <Button variant="ghost" className="text-zinc-400 hover:text-white">
                <Home size={20} className="mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Calendar size={24} className="text-purple-500 mr-3" />
            <h1 className="text-3xl font-bold">Upcoming Episodes Schedule</h1>
          </div>
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

        <UpcomingEpisodes episodeList={episodeList} isLoading={isLoading} />

        {error && !isLoading && <div className="text-center py-8 text-red-400">{error}</div>}

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
          <p>© {new Date().getFullYear()} Hatsu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

