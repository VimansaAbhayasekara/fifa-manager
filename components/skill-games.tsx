"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Dumbbell, Star, Clock, ChevronRight } from "lucide-react"

const skillGames = [
  {
    id: 1,
    name: "Player Knowledge Quiz",
    image: "/images/quiz-game.jpg",
    difficulty: "Medium",
    timeLimit: "10 minutes",
    description: "Test your knowledge of football players and their stats",
  },
  {
    id: 2,
    name: "Transfer Market Challenge",
    image: "/images/transfer-game.jpg",
    difficulty: "Hard",
    timeLimit: "15 minutes",
    description: "Build the best team possible with a limited budget",
  },
  {
    id: 3,
    name: "Position Master",
    image: "/images/position-game.jpg",
    difficulty: "Easy",
    timeLimit: "5 minutes",
    description: "Match players to their correct positions on the field",
  },
  {
    id: 4,
    name: "Stat Prediction",
    image: "/images/prediction-game.jpg",
    difficulty: "Medium",
    timeLimit: "8 minutes",
    description: "Predict player performance stats for upcoming matches",
  },
]

export function SkillGames() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-blue-900/60 backdrop-blur-sm border-blue-800/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-blue-300" />
              Skill Games
            </CardTitle>
            <CardDescription>Test your football knowledge and management skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden h-full group relative transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 bg-blue-900/40 border-blue-800/30">
                    <div className="relative h-48 w-full">
                      <Image
                        src={game.image || "/placeholder.svg?height=192&width=384"}
                        alt={game.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{game.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="text-blue-300 text-sm">{game.description}</p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1 text-blue-300 text-sm">
                            <Star className="h-4 w-4" />
                            <span>Difficulty: {game.difficulty}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-300 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{game.timeLimit}</span>
                          </div>
                        </div>
                        <Button className="w-full bg-blue-800 hover:bg-blue-700 text-white">
                          Play Now
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
