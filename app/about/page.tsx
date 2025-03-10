import Link from 'next/link'
import Image from 'next/image'
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Database,
  Palette,
  Globe,
  Server,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-500">
            Hatsu
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/home">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white"
              >
                Home
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[url('/images/hatsune_miku_vocaloid_wallpaper.jpg')] bg-cover bg-center opacity-10 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">
              Academic Project
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              About Hatsu
            </h1>
            <p className="text-xl text-zinc-300 mb-8">
              A modern anime streaming platform built with cutting-edge web
              technologies
            </p>
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="py-12 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Project Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-purple-400 mb-2">
                    Academic Details
                  </h3>
                  <ul className="space-y-2 text-zinc-300">
                    <li>
                      <span className="text-zinc-500">Subject:</span> ITS121-1L
                    </li>
                    <li>
                      <span className="text-zinc-500">Section:</span> FOPI01
                    </li>
                    <li>
                      <span className="text-zinc-500">Type:</span> Course Output
                    </li>
                    <li>
                      <span className="text-zinc-500">Submitted:</span>{' '}
                      {new Date().toLocaleDateString()}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-purple-400 mb-2">
                    Developer
                  </h3>
                  <ul className="space-y-2 text-zinc-300">
                    <li>
                      <span className="text-zinc-500">Name:</span> Wilson
                      Ponseca
                    </li>
                    <li>
                      <span className="text-zinc-500">Age:</span> 20 years old
                    </li>
                    <li>
                      <span className="text-zinc-500">Institution:</span> Mapua
                      Makati
                    </li>
                    <li>
                      <span className="text-zinc-500">Position:</span> Junior
                      Software Engineer
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-8 bg-zinc-800" />

              <div className="mb-8">
                <h3 className="text-lg font-medium text-purple-400 mb-4">
                  Project Overview
                </h3>
                <p className="text-zinc-300 mb-4">
                  Hatsu is a comprehensive anime streaming platform designed to
                  provide users with a seamless experience for discovering,
                  tracking, and watching their favorite anime series. This
                  project was developed as a course requirement, showcasing the
                  integration of modern web technologies and APIs.
                </p>
                <p className="text-zinc-300">
                  The platform features a responsive design, real-time data from
                  Anilist, and a user-friendly interface that makes navigation
                  intuitive. Users can browse trending anime, search for
                  specific titles, view detailed information about each series,
                  and watch episodes directly on the platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-4">
                  Project Goals
                </h3>
                <ul className="space-y-2 text-zinc-300 list-disc pl-5">
                  <li>Create a modern, responsive anime streaming platform</li>
                  <li>Implement real-time data fetching from external APIs</li>
                  <li>
                    Develop a user-friendly interface with intuitive navigation
                  </li>
                  <li>Showcase proficiency in Next.js and React development</li>
                  <li>Demonstrate integration of multiple data sources</li>
                  <li>
                    Apply best practices in web development and UI/UX design
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Technologies Used
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-zinc-900/60 border-zinc-800 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Next.js</h3>
                <p className="text-sm text-zinc-400">
                  React framework for building server-rendered applications with
                  App Router
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/60 border-zinc-800 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Tailwind CSS</h3>
                <p className="text-sm text-zinc-400">
                  Utility-first CSS framework for rapid UI development
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/60 border-zinc-800 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <div className="text-purple-400 font-bold text-lg">UI</div>
                </div>
                <h3 className="font-bold mb-2">shadcn/ui</h3>
                <p className="text-sm text-zinc-400">
                  Reusable UI components built with Radix UI and Tailwind CSS
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/60 border-zinc-800 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Anilist GraphQL</h3>
                <p className="text-sm text-zinc-400">
                  GraphQL API for fetching anime data and metadata
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/60 border-zinc-800 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <Server className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Consumet.org</h3>
                <p className="text-sm text-zinc-400">
                  Web scraping library for retrieving streaming content
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 mb-6">
              Additional libraries and tools used in this project include React,
              TypeScript, Axios, Framer Motion, Moment.js, and HLS.js for video
              streaming.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                'React',
                'TypeScript',
                'Axios',
                'Framer Motion',
                'Moment.js',
                'HLS.js',
              ].map((tech) => (
                <Badge key={tech} className="border-zinc-700">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                Anime Discovery
              </h3>
              <p className="text-zinc-300">
                Browse trending, popular, and latest anime releases with
                detailed information and ratings.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                Video Streaming
              </h3>
              <p className="text-zinc-300">
                Watch anime episodes in high quality with support for subtitles
                and adaptive streaming.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                Responsive Design
              </h3>
              <p className="text-zinc-300">
                Enjoy a seamless experience across all devices, from mobile
                phones to desktop computers.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                Real-time Updates
              </h3>
              <p className="text-zinc-300">
                Stay updated with the latest anime releases and airing schedules
                through API integration.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                Search Functionality
              </h3>
              <p className="text-zinc-300">
                Find your favorite anime quickly with an advanced search system
                and filtering options.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                User Authentication
              </h3>
              <p className="text-zinc-300">
                Create an account to track your watching progress, save
                favorites, and personalize your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-zinc-900/60 border border-zinc-800 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-purple-600">
                <Image
                  src="https://avatars.githubusercontent.com/u/128311166?v=4"
                  alt="Wilson Ponseca"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Wilson Ponseca</h2>
                <p className="text-purple-400 mb-4">Junior Software Engineer</p>

                <p className="text-zinc-300 mb-6">
                  A 20-year-old student at Mapua Makati with a passion for web
                  development and anime. This project showcases my skills in
                  modern web technologies and API integration.
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Link href={'https://github.com/Sentinail'}>
                    <Button
                      size="sm"
                      className="border-zinc-700 hover:border-purple-500 hover:bg-zinc-800 hover:cursor-pointer"
                    >
                      <Github className="h-4 w-4 mr-2" /> GitHub
                    </Button>
                  </Link>
                  <Link href={'https://www.linkedin.com/in/wilson-ponseca-40495026b/'}>
                    <Button
                      size="sm"
                      className="border-zinc-700 hover:border-purple-500 hover:bg-zinc-800 hover:cursor-pointer"
                    >
                      <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                    </Button>
                  </Link>
                  <Link href={'mailto:wilsongponseca@gmail.com'}>
                    <Button
                      size="sm"
                      className="border-zinc-700 hover:border-purple-500 hover:bg-zinc-800 hover:cursor-pointer"
                    >
                      <Mail className="h-4 w-4 mr-2" /> Contact
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgements Section */}
      <section className="py-12 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Acknowledgements
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
              <p className="text-zinc-300 mb-6 text-center">
                This project would not have been possible without the following
                resources and services:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://anilist.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-zinc-800/60 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="h-5 w-5 text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-medium">Anilist</h3>
                    <p className="text-xs text-zinc-400">
                      For their comprehensive anime database
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 ml-auto" />
                </a>

                <a
                  href="https://github.com/consumet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-zinc-800/60 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="h-5 w-5 text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-medium">Consumet.org</h3>
                    <p className="text-xs text-zinc-400">
                      For their streaming content API
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 ml-auto" />
                </a>

                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-zinc-800/60 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="h-5 w-5 text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-medium">Next.js</h3>
                    <p className="text-xs text-zinc-400">
                      For their powerful React framework
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 ml-auto" />
                </a>

                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-zinc-800/60 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="h-5 w-5 text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-medium">shadcn/ui</h3>
                    <p className="text-xs text-zinc-400">
                      For their beautiful UI components
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 ml-auto" />
                </a>
              </div>

              <p className="mt-6 text-center text-zinc-400 text-sm">
                Special thanks to the developers of Consumet and Anilist for their
                amazing work and contributions to the anime community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link
              href="/"
              className="text-2xl font-bold text-purple-500 mb-4 inline-block"
            >
              Hatsu
            </Link>
            <p className="text-zinc-400 max-w-md mx-auto mb-6">
              A modern anime streaming platform created as a course project for
              ITS121-1L at Mapua Makati.
            </p>
            <div className="flex justify-center space-x-4 mb-6">
              <Link href="/" className="text-zinc-400 hover:text-purple-400">
                Home
              </Link>
              <Link
                href="/about"
                className="text-zinc-400 hover:text-purple-400"
              >
                About
              </Link>
              <Link
                href="/home"
                className="text-zinc-400 hover:text-purple-400"
              >
                Browse
              </Link>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-purple-400"
              >
                Login
              </Link>
            </div>
            <div className="text-zinc-500 text-sm">
              <p>© {new Date().getFullYear()} Hatsu. All rights reserved.</p>
              <p className="mt-1">Created by Wilson Ponseca</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
