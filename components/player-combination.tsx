"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PlayerCard } from "./player-card"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PlayerCombinationType } from "@/types/player-combination"
import { Info, Star } from "lucide-react"

interface PlayerCombinationProps {
  combination: PlayerCombinationType
  budget: number
}

export function PlayerCombination({ combination, budget }: PlayerCombinationProps) {
  const [view, setView] = useState<"grid" | "list">("grid")

  const totalValue = combination.players.reduce((sum, player) => sum + player.market_value, 0)
  const budgetUsedPercentage = (totalValue / budget) * 100
  const averageRating =
    combination.players.reduce((sum, player) => sum + player.overall_rating, 0) / combination.players.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-800/30 p-4 border-blue-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-700/50 mr-3">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-blue-300">Average Rating</p>
                <p className="text-xl font-bold text-white">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-800/30 p-4 border-blue-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-700/50 mr-3">
                <Info className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-blue-300">Budget Used</p>
                <p className="text-xl font-bold text-white">€{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-800/30 p-4 border-blue-700/30">
          <div>
            <p className="text-sm text-blue-300 mb-1">Budget Efficiency</p>
            <Progress value={budgetUsedPercentage} className="h-2 mb-1" />
            <div className="flex justify-between text-xs text-blue-400">
              <span>{budgetUsedPercentage.toFixed(1)}% Used</span>
              <span>€{(budget - totalValue).toLocaleString()} Remaining</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {combination.players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PlayerCard player={player} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
