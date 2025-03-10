import Link from "next/link"
import Image from "next/image"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-500">
            Hatsu
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:cursor-pointer">
                <Search size={20} />
              </Button>
            </Link>
            <Link href="/home">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:cursor-pointer">
                <Home size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="relative w-64 h-64 mx-auto mb-8">
            <Image
              src="/images/hatsune_miku_404.png"
              alt="404 Error"
              fill
              className="object-contain"
            />
            <div className="absolute -bottom-4 -right-4 bg-purple-600 text-white text-xl font-bold rounded-full w-16 h-16 flex items-center justify-center animate-bounce">
              404
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Page Not Found
          </h1>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 mb-8">
            <p className="text-xl text-zinc-300 mb-4">Oops! This page doesn't exist or hasn't been implemented yet.</p>
            <p className="text-zinc-400 mb-6">
              The page you're looking for might be under construction, moved to a different URL, or was never created.
              Don't worry, there's plenty of anime to explore elsewhere on our site!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 hover:cursor-pointer">Go to Homepage</Button>
              </Link>
              <Link href="/home">
                <Button className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 hover:cursor-pointer">Browse Anime</Button>
              </Link>
            </div>
          </div>

          <div className="text-zinc-500 text-sm">
            <p>Error Code: 404 - Page Not Found</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Hatsu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

