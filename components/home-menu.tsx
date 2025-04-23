"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Trophy, Users, Dumbbell, Settings } from "lucide-react"

const menuItems = [
  {
    id: "auction",
    title: "MANAGER AUCTION",
    subtitle: "ASSISTANT",
    description: "Build your dream team with smart budget allocation",
    icon: Users,
    path: "/auction-assistant",
    color: "from-blue-600 to-blue-800",
    image: "/images/auction-card.jpg",
  },
  {
    id: "tournaments",
    title: "TOURNAMENTS",
    subtitle: "",
    description: "Compete in various tournaments and leagues",
    icon: Trophy,
    path: "/tournaments",
    color: "from-amber-500 to-amber-700",
    image: "/images/tournaments-card.jpg",
  },
  {
    id: "skill-games",
    title: "SKILL GAMES",
    subtitle: "",
    description: "Test your football knowledge and skills",
    icon: Dumbbell,
    path: "/skill-games",
    color: "from-emerald-600 to-emerald-800",
    image: "/images/skill-games-card.jpg",
  },
  {
    id: "management",
    title: "PLAYER",
    subtitle: "MANAGEMENT",
    description: "Add, edit and manage your player database",
    icon: Settings,
    path: "/player-management",
    color: "from-purple-600 to-purple-800",
    image: "/images/management-card.jpg",
  },
]

export function HomeMenu() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="py-12">
      <motion.h1
        className="text-5xl font-bold text-center mb-16 text-white drop-shadow-glow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        FOOTBALL MANAGER
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Link href={item.path}>
              <div className="relative overflow-hidden rounded-lg group h-64 border border-white/10 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r opacity-90 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-opacity-80 backdrop-blur-sm"></div>
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r opacity-80 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
                <div className="relative z-20 h-full flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <item.icon className="w-6 h-6 text-white mr-2" />
                      <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                    </div>
                    {item.subtitle && <h3 className="text-xl font-bold text-white mb-2">{item.subtitle}</h3>}
                    <p className="text-white/80">{item.description}</p>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-colors duration-300">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
