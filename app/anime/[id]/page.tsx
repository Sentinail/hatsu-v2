'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Play, Heart, Share2, Calendar, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import AnimeGrid from '@/features/home/components/AnimeGrid'
import moment from 'moment'
import Providers from '@/service'
import { useParams } from 'next/navigation'
import Header from '@/components/header'

interface AnimePageProps {
  id: string
}

export default function AnimePage() {
  const params: AnimePageProps = useParams<{ id: string }>()

  const [animeInfo, setAnimeInfo] = useState<any>(null)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState({
    info: true,
    episodes: true,
    recommendations: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [trendingAnime, setTrendingAnime] = useState([])

  useEffect(() => {
    const anilist = Providers.ANILIST

    const fetchData = async () => {
      try {
        // Fetch anime info
        const infoData = await anilist.fetchAnimeInfo({
          id: params.id,
          isCached: true,
        })
        if (infoData?.data?.Media) {
          setAnimeInfo(infoData.data.Media)
        } else {
          setError('Anime not found')
        }
        setIsLoading((prev) => ({ ...prev, info: false }))

        // Fetch episodes
        const episodesData = await anilist.fetchAnimeEpisodes({
          id: params.id,
          isCached: true,
        })
        if (episodesData) {
          setEpisodes(episodesData)
        }
        setIsLoading((prev) => ({ ...prev, episodes: false }))

        // Fetch trending anime for recommendations
        const trendingData = await anilist.fetchTrendingAnime({
          isCached: true,
        })
        if (trendingData?.data?.Page?.media) {
          setTrendingAnime(trendingData.data.Page.media)
        }
        setIsLoading((prev) => ({ ...prev, recommendations: false }))
      } catch (error) {
        console.error('Error fetching anime data:', error)
        setError('Failed to load anime data')
        setIsLoading({
          info: false,
          episodes: false,
          recommendations: false,
        })
      }
    }

    fetchData()
  }, [params.id])

  // Loading skeleton for the entire page
  if (isLoading.info) {
    return (
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Header skeleton */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="h-8 w-32 bg-zinc-800 rounded animate-pulse" />
            <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse" />
          </div>
        </header>

        {/* Cover image skeleton */}
        <div className="relative h-[300px] md:h-[400px] bg-zinc-800 animate-pulse" />

        {/* Anime info skeleton */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster skeleton */}
            <div className="shrink-0">
              <div className="relative w-[200px] aspect-[2/3] rounded-lg overflow-hidden border-4 border-black shadow-xl mx-auto md:mx-0 bg-zinc-800 animate-pulse" />
              <div className="mt-4 flex flex-col gap-2">
                <div className="h-10 w-full bg-zinc-800 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-10 bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Details skeleton */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse" />
              </div>

              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-16 bg-zinc-800 rounded-full animate-pulse"
                  />
                ))}
              </div>

              <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />

              <div className="space-y-2">
                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!animeInfo) return null

  // Format anime data for display
  const title =
    animeInfo.title.userPreferred ||
    animeInfo.title.english ||
    animeInfo.title.romaji
  const japaneseTitle = animeInfo.title.native
  const coverImage =
    animeInfo.coverImage?.extraLarge ||
    animeInfo.coverImage?.large ||
    'https://placehold.co/400x600'
  const bannerImage =
    animeInfo.bannerImage || 'https://placehold.co/1200x400'
  const description =
    animeInfo.description?.replace(/<[^>]*>/g, '') ||
    'No description available.'
  const genres = animeInfo.genres || []
  const rating = animeInfo.averageScore
    ? (animeInfo.averageScore / 10).toFixed(1)
    : 'N/A'
  const popularity = animeInfo.popularity
    ? `#${animeInfo.popularity}`
    : 'Unknown'

  // Format studio names
  const studios =
    animeInfo.studios?.nodes?.map((studio: any) => studio.name) || []

  // Format start date
  const startDate = animeInfo.startDate?.year
    ? `${animeInfo.startDate.month}/${animeInfo.startDate.day}/${animeInfo.startDate.year}`
    : 'Unknown'

  // Format related anime
  const relatedAnime: { mediaRecommendation: any }[] =
    animeInfo.recommendations?.nodes || []

  // Format characters
  const characters = animeInfo.characters?.nodes || []

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Cover Image */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src={bannerImage || 'https://placehold.co/1200x400'}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Anime Info */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="shrink-0">
              <div className="relative w-[200px] aspect-[2/3] rounded-lg overflow-hidden border-4 border-black shadow-xl mx-auto md:mx-0">
                <Image
                  src={coverImage || 'https://placehold.co/400x600'}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 hover:cursor-pointer">
                  <Play size={16} className="mr-2" /> Watch Now
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-zinc-700 hover:bg-zinc-800 hover:cursor-pointer"
                  >
                    <Heart size={16} className="mr-2" /> Add
                  </Button>
                  <Button
                    variant="outline"
                    className="border-zinc-700 hover:bg-zinc-800 hover:cursor-pointer"
                  >
                    <Share2 size={16} className="mr-2" /> Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
                {japaneseTitle && (
                  <p className="text-zinc-400 mt-1">{japaneseTitle}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {genres.map((genre: string) => (
                  <Link
                    href={`/search?genre=${genre.toLowerCase()}`}
                    key={genre}
                    className="text-xs px-2 py-1 bg-zinc-800 hover:bg-purple-600/80 rounded-full transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star
                    size={20}
                    className="text-yellow-400 mr-1"
                    fill="currentColor"
                  />
                  <span className="font-bold">{rating}</span>
                  <span className="text-zinc-400 text-sm ml-1">/10</span>
                </div>
                <div className="text-sm text-zinc-400">
                  Popularity: {popularity}
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed">{description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-zinc-400">Type</p>
                  <p>{animeInfo.format || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Status</p>
                  <p>{animeInfo.status || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Studios</p>
                  <p>{studios.length > 0 ? studios.join(', ') : 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Aired</p>
                  <p>{startDate}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Season</p>
                  <p>{animeInfo.season || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-zinc-400">Duration</p>
                  <p>
                    {animeInfo.duration
                      ? `${animeInfo.duration} min per ep`
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="episodes" className="space-y-6">
              <TabsList className="bg-zinc-900 border-b border-zinc-800 p-0 h-auto w-full justify-start rounded-none">
                <TabsTrigger
                  value="episodes"
                  className="py-3 px-6 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-none"
                >
                  Episodes
                </TabsTrigger>
                <TabsTrigger
                  value="characters"
                  className="py-3 px-6 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-none"
                >
                  Characters
                </TabsTrigger>
                <TabsTrigger
                  value="related"
                  className="py-3 px-6 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-none"
                >
                  Recommended
                </TabsTrigger>
              </TabsList>

              <TabsContent value="episodes" className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Episodes</h3>
                  {animeInfo.episodes && episodes.length > 0 && (
                    <div className="text-sm text-zinc-400">
                      <span className="font-medium text-white">
                        {episodes.length}
                      </span>{' '}
                      / {animeInfo.episodes} Episodes
                    </div>
                  )}
                </div>

                {animeInfo.episodes && episodes.length > 0 && (
                  <Progress
                    value={(episodes.length / animeInfo.episodes) * 100}
                    className="h-1 bg-zinc-800"
                  />
                )}

                {isLoading.episodes ? (
                  // Episodes loading skeleton
                  <div className="space-y-4 mt-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 animate-pulse"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-[180px] h-[100px] sm:h-auto bg-zinc-800" />
                          <div className="p-4 flex-1">
                            <div className="h-5 w-3/4 bg-zinc-800 rounded mb-2" />
                            <div className="h-4 w-1/2 bg-zinc-800 rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : episodes.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    {episodes.map((episode) => (
                      <div
                        key={episode.id}
                        className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-[180px] h-[100px] sm:h-auto">
                            <Image
                              src={
                                episode.image ||
                                '/https://placehold.co/300x200'
                              }
                              alt={`Episode ${episode.number}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                              <Link href={`/watch/${episode.id}` || '#'}>
                                <Button
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
                                >
                                  <Play size={16} />
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  Episode {episode.number}:{' '}
                                  {episode.title || `Episode ${episode.number}`}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                                  {episode.createdAt && (
                                    <div className="flex items-center">
                                      <Calendar size={14} className="mr-1" />
                                      {moment(episode.createdAt).format(
                                        'MMM D, YYYY'
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-zinc-400 hover:text-white hover:cursor-pointer"
                              >
                                <List size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-400">
                    No episodes available for this anime.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="characters" className="mt-6">
                {characters.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {characters.map((character: any) => (
                      <Link
                        href={`/character/${character.id}`}
                        key={character.id}
                        className="group"
                      >
                        <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-colors text-center p-4">
                          <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                            <Image
                              src={
                                character.image?.medium ||
                                'https://placehold.co/200x200'
                              }
                              alt={character.name?.full || 'Character'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h3 className="font-medium text-sm mb-1">
                            {character.name?.full ||
                              character.name?.userPreferred}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            {character.gender || 'Character'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-400">
                    No character information available.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="related" className="mt-6">
                {relatedAnime.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {relatedAnime.map(({ mediaRecommendation }) => (
                      <Link
                        href={`/anime/${mediaRecommendation.id}`}
                        key={mediaRecommendation.id}
                        className="group"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                          <Image
                            src={
                              mediaRecommendation.coverImage?.large ||
                              'https://placehold.co/400x600'
                            }
                            alt={
                              mediaRecommendation.title?.userPreferred ||
                              mediaRecommendation.title?.english ||
                              'Related anime'
                            }
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-medium text-sm line-clamp-1">
                          {mediaRecommendation.title?.userPreferred ||
                            mediaRecommendation.title?.english ||
                            mediaRecommendation.title?.romaji}
                        </h3>
                        <p className="text-zinc-400 text-xs">
                          {mediaRecommendation.format || 'Anime'}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-400">
                    No related anime available.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Trending */}
          <section className="mt-16 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <Link
                href="/recommendations"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                View More
              </Link>
            </div>
            <AnimeGrid
              animeList={trendingAnime}
              isLoading={isLoading.recommendations}
              category="Recommended"
            />
          </section>
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
