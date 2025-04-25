"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Users, Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function HomeMenu() {
  const [mounted, setMounted] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const featuredItems = [
    {
      id: "tournaments",
      title: "NEXT FEATURE",
      subtitle: "EL-CLASSICO",
      icon: Star,
      path: "/player-management",
      color: "from-purple-600 to-purple-800",
      image: "/images/im1.jpeg",
      size: "large"
    },
    {
      id: "auction",
      title: "AUCTION ASSISTANT",
      subtitle: "Find the best player combinations for your budget",
      icon: Users,
      path: "/auction-assistant",
      color: "from-blue-600 to-blue-800",
      image: "/images/back22.jpg",
      size: "large",
    },
    {
      id: "gallery",
      title: "PLAYER GALLERY",
      subtitle: "Browse and filter all players in the database",
      icon: Search,
      path: "/player-gallery",
      color: "from-emerald-600 to-emerald-800",
      image: "/images/im6.jpg",
      size: "large",
    },
   
  ]

  const secondaryItems = [
    {
      id: "kickoff",
      title: "KICK OFF",
      subtitle: "Play a quick match with your favorite teams",
      path: "/tournaments",
      image: "/images/im4.jpg",
      badge: {
        teams: [
          { name: "R. MADRID", logo: "/images/logo.png" },
          { name: "M. CITY", logo: "/images/logo2.png" },
        ],
      },
    },
    {
      id: "tournaments",
      title: "TOURNAMENTS",
      subtitle: "Explore and manage football tournaments",
      path: "/tournaments",
      image: "/images/back2.png",
    },
    {
      id: "skill-games",
      title: "SKILL GAMES",
      subtitle: "Test your football knowledge with fun games",
      path: "/skill-games",
      image: "/images/back3.jpg",
    },
  ]

  const indicators = Array(featuredItems.length).fill(0)

  return (
    <div className="py-1">
      {/* Featured Carousel */}
      <div className="relative mb-8">
        <div className="flex overflow-hidden">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={cn(
                "flex-shrink-0 w-full transition-all duration-500 ease-in-out",
                activeSlide === index ? "block" : "hidden",
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href={item.path}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
                  <div className="md:col-span-2 relative overflow-hidden rounded-lg h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent z-10" />
                    <Image src={item.image || "/back2.png"} alt={item.title} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h2 className="text-4xl font-bold text-white mb-2">{item.title}</h2>
                      <p className="text-xl text-blue-100">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-lg h-full bg-blue-900/30 backdrop-blur-sm border border-blue-800/50">
                    
                          <Image
                            src="/images/pl3.png"
                            width={2220}
                            height={4220}
                            alt="Team Logo"

                          />



                      </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-30">
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <ChevronRight className="w-5 h-5 transform rotate-180" />
          </button>
          <div className="flex gap-2">
            {indicators.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-3 rounded-full ${activeSlide === i ? "bg-blue-500" : "bg-white/30"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveSlide((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Secondary Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondaryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Link href={item.path}>
              <div className="relative overflow-hidden rounded-lg h-[250px] border border-blue-800/30 group">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent z-10" />
                <Image
                  src={item.image || "/images/pl1.png"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>

                  {item.badge?.teams ? (
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 relative">
                          <Image
                            src={item.badge.teams[0].logo || "/placeholder.svg"}
                            alt={item.badge.teams[0].name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-white ml-2">{item.badge.teams[0].name}</span>
                      </div>

                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white">
                        V
                      </div>

                      <div className="flex items-center">
                        <span className="text-white mr-2">{item.badge.teams[1].name}</span>
                        <div className="w-12 h-12 relative">
                          <Image
                            src={item.badge.teams[1].logo || "/placeholder.svg"}
                            alt={item.badge.teams[1].name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-blue-100">{item.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
