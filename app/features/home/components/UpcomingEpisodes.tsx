import { CalendarDays, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import moment from "moment"

interface UpcomingEpisodesProps {
  episodeList: any[]
  isLoading?: boolean
}

export default function UpcomingEpisodes({ episodeList = [], isLoading = false }: UpcomingEpisodesProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 animate-pulse">
            <div className="relative h-24 bg-zinc-800" />
            <div className="p-3">
              <div className="h-4 bg-zinc-800 rounded mb-1 w-3/4" />
              <div className="h-3 bg-zinc-800 rounded mb-2 w-1/2" />
              <div className="flex items-center text-xs text-zinc-400">
                <div className="h-3 bg-zinc-800 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (episodeList.length === 0) {
    return <div className="text-center py-8 text-zinc-400">No upcoming episodes found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {episodeList.map((schedule) => {
        const anime = schedule.media
        const airingTime = moment.unix(schedule.airingAt)
        const timeUntil = moment.duration(schedule.timeUntilAiring, "seconds")
        const countdown = timeUntil.humanize(true);

        return (
          <Link
            href={`/anime/${anime.id}`}
            key={`${anime.id}-${schedule.episode}`}
            className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-colors"
          >
            <div className="relative h-24">
              <Image
                src={anime.coverImage?.large || anime.coverImage?.medium || "https://placehold.co/200x120"}
                alt={anime.title.userPreferred || anime.title.english || anime.title.romaji}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-2 right-2 bg-purple-600 text-xs px-2 py-0.5 rounded-full">
                {countdown}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm mb-1 line-clamp-1">
                {anime.title.userPreferred || anime.title.english || anime.title.romaji}
              </h3>
              <p className="text-zinc-400 text-xs mb-2">Episode {schedule.episode}</p>
              <div className="flex items-center text-xs text-zinc-400">
                <CalendarDays size={12} className="mr-1" />
                <span className="mr-3">{airingTime.format("MMM D")}</span>
                <Clock size={12} className="mr-1" />
                <span>{airingTime.format("h:mm A")}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

