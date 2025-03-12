'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  Subtitles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Hls from 'hls.js'
import Providers from '@/service'

interface WatchPageProps {
  id: string
}

export default function WatchPage() {
  const params: WatchPageProps = useParams<{ id: string }>()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [episodeData, setEpisodeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const anilist = Providers.ANILIST
        const data = await anilist.fetchEpisodeStream({
          id: params.id,
          isCached: false,
        })
        
        if (!data || !data.sources || data.sources.length === 0) {
          throw new Error('No video sources found')
        }

        setEpisodeData(data)

        // Auto-select English subtitles if available
        if (data.subtitles && data.subtitles.length > 0) {
          const englishSub = data.subtitles.find((sub: any) =>
            sub.lang.includes('English')
          )
          if (englishSub) {
            setSelectedSubtitle(englishSub.url)
          }
        }
      } catch (err) {
        console.error('Failed to fetch episode:', err)
        setError('Failed to load video. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEpisodeData()

    // Clean up controls timeout on unmount
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [params.id])

  useEffect(() => {
    if (!videoRef.current || !episodeData || !episodeData.sources) return

    const video = videoRef.current
    const source =
      episodeData.sources.find((s: any) => s.isM3U8) || episodeData.sources[0]

    if (Hls.isSupported() && source.isM3U8) {
      // Create a new HLS instance
      const hls = new Hls()
      hlsRef.current = hls

      // Use proxy URL if available
      const sourceUrl = process.env.NEXT_PUBLIC_PROXY_URL
        ? `${process.env.NEXT_PUBLIC_PROXY_URL}/hianime-hls-proxy?url=${source.url}`
        : source.url

      hls.loadSource(sourceUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Auto play when loaded
        video.play().catch((e) => console.log('Auto play prevented:', e))
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      video.src = source.url
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((e) => console.log('Auto play prevented:', e))
      })
    }

    // Set up event listeners
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onDurationChange = () => setDuration(video.duration)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('volumechange', onVolumeChange)

    return () => {
      // Clean up event listeners
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('volumechange', onVolumeChange)

      // Clean up HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      // Stop video and clear source
      video.pause()
      video.src = ''
      video.load()
    }
  }, [episodeData])

  // Handle controls visibility
  useEffect(() => {
    const hideControls = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    if (isPlaying) {
      hideControls()
    } else {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  // Clean up everything when component unmounts
  useEffect(() => {
    return () => {
      // This ensures we clean up everything when navigating away
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      if (videoRef.current) {
        const video = videoRef.current
        video.pause()
        video.src = ''
        video.load()
      }
    }
  }, [])

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch((e) => console.log('Play prevented:', e))
    }
  }

  const handleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
  }

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const newVolume = value[0]
    videoRef.current.volume = newVolume
  }

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value[0]
  }

  const handleFullscreen = () => {
    if (!containerRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  const handleSkipIntro = () => {
    if (!videoRef.current || !episodeData || !episodeData.intro) return
    videoRef.current.currentTime = episodeData.intro.end
  }

  const handleSubtitleChange = (url: string) => {
    setSelectedSubtitle(url)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Show intro skip button if within intro time range
  const showIntroSkip =
    episodeData?.intro &&
    currentTime >= episodeData.intro.start &&
    currentTime < episodeData.intro.end

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-zinc-400 mb-6">{error}</p>
        <Button
          onClick={() => router.back()}
          className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
        >
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Video Player */}
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-black"
        onMouseMove={() => {
          setShowControls(true)
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
          }
          if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(
              () => setShowControls(false),
              3000
            )
          }
        }}
        onClick={handlePlayPause}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          playsInline
          crossOrigin="anonymous"
        >
          {selectedSubtitle && (
            <track
              kind="subtitles"
              src={selectedSubtitle}
              label="English"
              default
            />
          )}
          Your browser does not support the video tag.
        </video>

        {/* Video Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Controls */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/30 hover:cursor-pointer"
              onClick={() => {
                // Clean up before navigating away
                if (hlsRef.current) {
                  hlsRef.current.destroy()
                  hlsRef.current = null
                }

                if (videoRef.current) {
                  videoRef.current.pause()
                  videoRef.current.src = ''
                  videoRef.current.load()
                }

                router.back()
              }}
            >
              <ArrowLeft size={24} />
            </Button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center justify-center">
            {showIntroSkip && (
              <Button
                className="absolute right-8 bottom-24 bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
                onClick={handleSkipIntro}
              >
                <SkipForward size={16} className="mr-2" /> Skip Intro
              </Button>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-black/30 hover:cursor-pointer"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-black/30 hover:cursor-pointer"
                    onClick={handleMute}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>

                  <div className="w-24 hidden sm:block">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </div>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Subtitles Menu */}
                {episodeData?.subtitles && episodeData.subtitles.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-black/30 hover:cursor-pointer"
                      >
                        <Subtitles size={20} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 bg-zinc-900 border-zinc-800 text-white p-0">
                      <div className="p-2 font-semibold border-b border-zinc-800">
                        Subtitles
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <div
                          className={`p-2 cursor-pointer hover:bg-zinc-800 ${
                            !selectedSubtitle ? 'bg-purple-600/30' : ''
                          }`}
                          onClick={() => setSelectedSubtitle(null)}
                        >
                          Off
                        </div>
                        {episodeData.subtitles.map(
                          (sub: any, index: number) => (
                            <div
                              key={index}
                              className={`p-2 cursor-pointer hover:bg-zinc-800 ${
                                selectedSubtitle === sub.url
                                  ? 'bg-purple-600/30'
                                  : ''
                              }`}
                              onClick={() => handleSubtitleChange(sub.url)}
                            >
                              {sub.lang}
                            </div>
                          )
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-black/30 hover:cursor-pointer"
                  onClick={handleFullscreen}
                >
                  <Maximize size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
