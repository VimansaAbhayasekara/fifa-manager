"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Player } from "@/types/player"

export function GalleryCard({ player }: { player: Player }) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate a color based on player rating
  const getCardColor = (rating: number) => {
    if (rating >= 90) return "from-amber-500 to-yellow-600" // Gold
    if (rating >= 85) return "from-emerald-500 to-green-600" // Emerald
    if (rating >= 80) return "from-blue-500 to-blue-600" // Blue
    if (rating >= 75) return "from-purple-500 to-purple-600" // Purple
    if (rating >= 70) return "from-pink-500 to-pink-600" // Pink
    return "from-gray-500 to-gray-600" // Silver
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="relative h-[360px] perspective-1000"
      variants={item}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
        {/* Card Background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${getCardColor(player.overall_rating)} opacity-90`}></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16"></div>
        </div>

        {/* Card Content */}
        <div className="absolute inset-0 p-4 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="bg-white/90 rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
                {player.overall_rating}
              </div>
              <div className="text-white font-bold text-lg">{player.position?.code || "N/A"}</div>
            </div>

            {player.country && (
              <div className="h-6 w-8 overflow-hidden rounded-sm">
                <Image
                  src={player.country.flag_url || "/placeholder.svg"}
                  alt={player.country.name}
                  width={32}
                  height={24}
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Player Image */}
          <div className="flex-1 flex items-center justify-center my-2 relative">
            <motion.div
              animate={{
                y: isHovered ? -5 : 0,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="relative h-32 w-32"
            >
              <Image
                src={player.image_url || "/placeholder.svg?height=128&width=128"}
                alt={player.name}
                width={128}
                height={128}
                className="object-cover rounded-full border-4 border-white/80 shadow-lg"
              />
            </motion.div>

            {player.club && (
              <motion.div
                className="absolute bottom-0 right-0 h-10 w-10 overflow-hidden"
                animate={{
                  rotate: isHovered ? 10 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
              >
                <Image
                  src={player.club.logo_url || "/placeholder.svg"}
                  alt={player.club.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
            )}
          </div>

          {/* Player Name */}
          <div className="text-center">
            <h3 className="font-bold text-white text-lg tracking-wider truncate">{player.name}</h3>
            <p className="text-white/80 text-sm">{player.age} years</p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-1 text-xs">
            <div className="bg-black/20 rounded p-1 text-center">
              <div className="text-white/80">PAC</div>
              <div className="text-white font-bold">{player.pace}</div>
            </div>
            <div className="bg-black/20 rounded p-1 text-center">
              <div className="text-white/80">SHO</div>
              <div className="text-white font-bold">{player.shooting}</div>
            </div>
            <div className="bg-black/20 rounded p-1 text-center">
              <div className="text-white/80">PAS</div>
              <div className="text-white font-bold">{player.passing}</div>
            </div>
            <div className="bg-black/20 rounded p-1 text-center">
              <div className="text-white/80">DRI</div>
              <div className="text-white font-bold">{player.dribbling}</div>
            </div>
            <div className="bg-black/20 rounded p-1 text-center">
              <div className="text-white/80">DEF</div>
              <div className="text-white font-bold">{player.defending}</div>
            </div>
            <div className="bg-black/20 rounded p-1 text-center">
              <div className="text-white/80">PHY</div>
              <div className="text-white font-bold">{player.physical}</div>
            </div>
          </div>

          {/* Value */}
          <div className="mt-2 bg-black/30 rounded-full py-1 px-3 text-center">
            <span className="text-white/90 text-sm font-medium">€{(player.market_value / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
