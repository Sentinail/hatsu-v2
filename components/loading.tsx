"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Loading() {
  const [progress, setProgress] = useState(0)

  // Simulate loading progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(10)
    }, 100)

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 15)
        return newProgress > 100 ? 100 : newProgress
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4 flex flex-col items-center">
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse"></div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-4xl font-bold text-purple-500">A</span>
          </motion.div>

          {/* Orbiting dot */}
          <motion.div
            className="absolute w-3 h-3 bg-purple-500 rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              originX: "50%",
              originY: "50%",
              translateX: "-50%",
              translateY: "-50%",
              left: "50%",
              top: "0%",
            }}
          />
        </div>

        <motion.h2
          className="text-xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading Hatsu
        </motion.h2>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <motion.p
          className="text-zinc-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress < 100 ? "Preparing your anime experience..." : "Almost there!"}
        </motion.p>

        {/* Animated dots */}
        <div className="flex mt-4 space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Random anime quotes */}
      <motion.div
        className="absolute bottom-8 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-zinc-500 italic text-sm">
          "The world isn't perfect. But it's there for us, doing the best it can."
        </p>
      </motion.div>
    </div>
  )
}

