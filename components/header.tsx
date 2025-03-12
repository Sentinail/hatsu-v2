'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X, Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    // For other paths, check if the pathname starts with the path
    // This handles nested routes like /home/subpage
    return pathname.startsWith(path)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mr-8"
            >
              Hatsu
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`hover:text-purple-400 hover:bg-zinc-800 hover:cursor-pointer ${
                      isActive('/browse')
                        ? 'text-purple-400 bg-zinc-800/50'
                        : 'text-white'
                    }`}
                  >
                    Browse <ChevronDown size={16} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-700 text-white">
                  <DropdownMenuItem
                    className={`hover:bg-zinc-800 ${isActive('/trending') ? 'bg-zinc-800/50 text-purple-400' : ''}`}
                  >
                    <Link href="/trending" className="w-full">
                      Trending
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`hover:bg-zinc-800 ${isActive('/latest') ? 'bg-zinc-800/50 text-purple-400' : ''}`}
                  >
                    <Link href="/latest" className="w-full">
                      Latest
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`hover:bg-zinc-800 ${isActive('/popular') ? 'bg-zinc-800/50 text-purple-400' : ''}`}
                  >
                    <Link href="/popular" className="w-full">
                      Popular
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`hover:bg-zinc-800 ${isActive('/schedule') ? 'bg-zinc-800/50 text-purple-400' : ''}`}
                  >
                    <Link href="/schedule" className="w-full">
                      Schedule
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/home">
                <Button
                  variant="ghost"
                  className={`hover:text-purple-400 hover:bg-zinc-800 hover:cursor-pointer ${
                    isActive('/home')
                      ? 'text-purple-400 bg-zinc-800/50'
                      : 'text-white'
                  }`}
                >
                  Home
                </Button>
              </Link>

              <Link href="/schedule">
                <Button
                  variant="ghost"
                  className={`hover:text-purple-400 hover:bg-zinc-800 hover:cursor-pointer ${
                    isActive('/schedule')
                      ? 'text-purple-400 bg-zinc-800/50'
                      : 'text-white'
                  }`}
                >
                  Schedule
                </Button>
              </Link>

              <Link href="/about">
                <Button
                  variant="ghost"
                  className={`hover:text-purple-400 hover:bg-zinc-800 hover:cursor-pointer ${
                    isActive('/about')
                      ? 'text-purple-400 bg-zinc-800/50'
                      : 'text-white'
                  }`}
                >
                  About
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/search"
                    className={`p-2 hover:text-white transition ${
                      isActive('/search') ? 'text-purple-400' : 'text-zinc-400'
                    }`}
                  >
                    <Search size={20} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className={`hover:text-purple-400 hover:bg-zinc-800 hover:cursor-pointer ${
                    isActive('/login')
                      ? 'text-purple-400 bg-zinc-800/50'
                      : 'text-white'
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white hover:cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-zinc-400 hover:text-white hover:bg-transparent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="mt-4 flex flex-col space-y-2 pb-4">
                <Link href="/home" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start hover:text-purple-400 hover:bg-zinc-800 ${
                      isActive('/home')
                        ? 'text-purple-400 bg-zinc-800/50'
                        : 'text-white'
                    }`}
                  >
                    Home
                  </Button>
                </Link>
                <Link href="/browse" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start hover:text-purple-400 hover:bg-zinc-800 ${
                      isActive('/browse')
                        ? 'text-purple-400 bg-zinc-800/50'
                        : 'text-white'
                    }`}
                  >
                    Browse
                  </Button>
                </Link>
                <Link href="/schedule" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start hover:text-purple-400 hover:bg-zinc-800 ${
                      isActive('/schedule')
                        ? 'text-purple-400 bg-zinc-800/50'
                        : 'text-white'
                    }`}
                  >
                    Schedule
                  </Button>
                </Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start hover:text-purple-400 hover:bg-zinc-800 ${
                      isActive('/about')
                        ? 'text-purple-400 bg-zinc-800/50'
                        : 'text-white'
                    }`}
                  >
                    About
                  </Button>
                </Link>
                <div className="pt-2 flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className={`w-full border-zinc-700 ${
                        isActive('/login')
                          ? 'border-purple-500/50 text-purple-400'
                          : ''
                      }`}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
