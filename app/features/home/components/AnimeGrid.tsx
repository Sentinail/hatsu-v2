import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

interface AnimeGridProps {
  animeList: any[]
  isLoading?: boolean
  category?: string
}

export default function AnimeGrid({ animeList = [], isLoading = false, category = "" }: AnimeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-zinc-800" />
            <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (animeList.length === 0) {
    return <div className="text-center py-8 text-zinc-400">No anime found for this category.</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {animeList.map((anime) => (
        <Link href={`/anime/${anime.id}`} key={anime.id} className="group">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
            <Image
              src={anime.coverImage.large || "https://placehold.co/200x300"}
              alt={anime.title.userPreferred || anime.title.english || anime.title.romaji}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {anime.averageScore && (
              <div className="absolute top-2 right-2 bg-black/70 px-1.5 py-0.5 rounded flex items-center text-xs">
                <Star size={12} className="text-yellow-400 mr-1" fill="currentColor" />
                {anime.averageScore / 10}
              </div>
            )}
          </div>
          <h3 className="font-medium text-sm line-clamp-1">
            {anime.title.userPreferred || anime.title.english || anime.title.romaji}
          </h3>
          <p className="text-zinc-400 text-xs">{anime.season || category}</p>
        </Link>
      ))}
    </div>
  )
}

