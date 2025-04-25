"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Trophy, Calendar, Users, ChevronRight } from "lucide-react"

const tournaments = [
  {
    id: 1,
    name: "Champions League",
    image: "/images/cover3.jpg",
    teams: 32,
    startDate: "September 2023",
    endDate: "May 2024",
    description: "The premier club competition in European football",
  },
  {
    id: 2,
    name: "Premier League",
    image: "/images/cover3.jpg",
    teams: 20,
    startDate: "August 2023",
    endDate: "May 2024",
    description: "England's top tier professional football league",
  },
  {
    id: 3,
    name: "La Liga",
    image: "/images/cover3.jpg",
    teams: 20,
    startDate: "August 2023",
    endDate: "May 2024",
    description: "The men's top professional football division of Spain",
  },
  {
    id: 4,
    name: "Bundesliga",
    image: "/images/cover3.jpg",
    teams: 18,
    startDate: "August 2023",
    endDate: "May 2024",
    description: "Germany's primary football competition",
  },
]

export function Tournaments() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-blue-900/60 backdrop-blur-sm border-blue-800/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-blue-300" />
              Tournaments
            </CardTitle>
            <CardDescription>Explore and manage football tournaments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournaments.map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden h-full group relative transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 bg-blue-900/40 border-blue-800/30">
                    <div className="relative h-48 w-full">
                      <Image
                        src={tournament.image || "/placeholder.svg?height=192&width=384"}
                        alt={tournament.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="text-blue-300 text-sm">{tournament.description}</p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1 text-blue-300 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {tournament.startDate} - {tournament.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-300 text-sm">
                            <Users className="h-4 w-4" />
                            <span>{tournament.teams} Teams</span>
                          </div>
                        </div>
                        <Button className="w-full bg-blue-800 hover:bg-blue-700 text-white">
                          View Tournament
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
