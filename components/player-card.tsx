"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { Player } from "@/types/player"
import { StarRating } from "./star-rating"

export function PlayerCard({ player }: { player: Player }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="perspective-1000 h-[400px] w-full cursor-pointer" onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Front of card */}
        <div className={`absolute inset-0 backface-hidden ${isFlipped ? "opacity-0" : "opacity-100"}`}>
          <Card className="overflow-hidden h-full group relative transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 bg-gradient-to-b from-blue-900 to-blue-950 border-blue-800/50">
            <div className="relative bg-gradient-to-b from-emerald-400 to-emerald-600 pt-6 pb-2 px-4">
              <div className="absolute top-2 left-2 flex items-center gap-1 text-white font-bold">
                <span className="text-3xl">{player.overall_rating}</span>
                <span className="text-sm">OVR</span>
              </div>

              <div className="absolute top-2 right-2 flex items-center gap-1 text-white font-bold">
                <span className="text-sm">{player.position?.code}</span>
              </div>

              {player.country && (
                <div className="absolute top-12 right-2 h-6 w-8 overflow-hidden rounded-sm">
                  <Image
                    src={player.country.flag_url || "/placeholder.svg"}
                    alt={player.country.name}
                    width={32}
                    height={24}
                    className="object-cover"
                  />
                </div>
              )}

              {player.club && (
                <div className="absolute top-20 right-2 h-8 w-8 overflow-hidden">
                  <Image
                    src={player.club.logo_url || "/placeholder.svg"}
                    alt={player.club.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              )}

              <div className="h-32 w-32 mx-auto relative">
                <Image
                  src={player.image_url || "/placeholder.svg?height=128&width=128"}
                  alt={player.name}
                  width={128}
                  height={128}
                  className="object-cover rounded-full border-4 border-white"
                />
              </div>

              <div className="text-center text-white mt-2">
                <h3 className="font-bold uppercase tracking-wider">{player.name}</h3>
              </div>
            </div>

            <div className="bg-blue-900 p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-300">PAC</span>
                  <span className="font-bold text-white">{player.pace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">DRI</span>
                  <span className="font-bold text-white">{player.dribbling}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">SHO</span>
                  <span className="font-bold text-white">{player.shooting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">DEF</span>
                  <span className="font-bold text-white">{player.defending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">PAS</span>
                  <span className="font-bold text-white">{player.passing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">PHY</span>
                  <span className="font-bold text-white">{player.physical}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-blue-300 text-xs">Age</p>
                  <p className="font-bold text-white">{player.age}</p>
                </div>
                <div>
                  <p className="text-blue-300 text-xs">Value</p>
                  <p className="font-bold text-emerald-400">€{(player.market_value / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-blue-300 text-xs">Rating</p>
                  <StarRating rating={Math.round(player.overall_rating / 20)} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Back of card */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? "opacity-100" : "opacity-0"}`}>
          <Card className="overflow-hidden h-full group relative transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 bg-gradient-to-b from-blue-900 to-blue-950 border-blue-800/50 p-4">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                {player.club && (
                  <div className="h-8 w-8 overflow-hidden">
                    <Image
                      src={player.club.logo_url || "/placeholder.svg"}
                      alt={player.club.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white">{player.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-300 text-sm">{player.position?.name}</span>
                    {player.country && (
                      <div className="h-4 w-5 overflow-hidden rounded-sm">
                        <Image
                          src={player.country.flag_url || "/placeholder.svg"}
                          alt={player.country.name}
                          width={20}
                          height={16}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-800/50 rounded-md p-2">
                    <p className="text-blue-300 text-xs">Age</p>
                    <p className="font-bold text-white">{player.age} years</p>
                  </div>
                  <div className="bg-blue-800/50 rounded-md p-2">
                    <p className="text-blue-300 text-xs">Value</p>
                    <p className="font-bold text-emerald-400">€{(player.market_value / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="bg-blue-800/50 rounded-md p-2">
                    <p className="text-blue-300 text-xs">Club</p>
                    <p className="font-bold text-white">{player.club?.name || "Unknown"}</p>
                  </div>
                  <div className="bg-blue-800/50 rounded-md p-2">
                    <p className="text-blue-300 text-xs">Country</p>
                    <p className="font-bold text-white">{player.country?.name || "Unknown"}</p>
                  </div>
                </div>

                <div className="bg-blue-800/50 rounded-md p-3">
                  <p className="text-blue-300 text-xs mb-1">Overall Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{player.overall_rating}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                          style={{ width: `${player.overall_rating}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-800/50 rounded-md p-3">
                  <p className="text-blue-300 text-xs mb-2">Key Attributes</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="h-1 bg-blue-950 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-emerald-500" style={{ width: `${player.pace}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">PAC</span>
                        <span className="text-white">{player.pace}</span>
                      </div>
                    </div>
                    <div>
                      <div className="h-1 bg-blue-950 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-emerald-500" style={{ width: `${player.dribbling}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">DRI</span>
                        <span className="text-white">{player.dribbling}</span>
                      </div>
                    </div>
                    <div>
                      <div className="h-1 bg-blue-950 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-emerald-500" style={{ width: `${player.shooting}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">SHO</span>
                        <span className="text-white">{player.shooting}</span>
                      </div>
                    </div>
                    <div>
                      <div className="h-1 bg-blue-950 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-emerald-500" style={{ width: `${player.defending}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">DEF</span>
                        <span className="text-white">{player.defending}</span>
                      </div>
                    </div>
                    <div>
                      <div className="h-1 bg-blue-950 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-emerald-500" style={{ width: `${player.passing}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">PAS</span>
                        <span className="text-white">{player.passing}</span>
                      </div>
                    </div>
                    <div>
                      <div className="h-1 bg-blue-950 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-emerald-500" style={{ width: `${player.physical}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">PHY</span>
                        <span className="text-white">{player.physical}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs text-blue-300">Tap card to flip</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
