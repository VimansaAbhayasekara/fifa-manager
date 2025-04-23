"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Position } from "@/types/position"
import { createClient } from "@/lib/supabase/client"
import { Users, Filter } from "lucide-react"

export function PlayerFilters({
  onPositionChange,
  selectedPositions,
}: {
  onPositionChange: (positions: Position[]) => void
  selectedPositions: Position[]
}) {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("positions")

  useEffect(() => {
    async function fetchPositions() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("positions").select("*").order("id")

        if (error) throw error

        setPositions(data || [])
      } catch (error) {
        console.error("Error fetching positions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()
  }, [])

  const togglePosition = (position: Position) => {
    if (selectedPositions.some((p) => p.id === position.id)) {
      onPositionChange(selectedPositions.filter((p) => p.id !== position.id))
    } else {
      onPositionChange([...selectedPositions, position])
    }
  }

  const positionsByType = {
    defenders: positions.filter((p) => ["GK", "RB", "CB", "LB"].includes(p.code)),
    midfielders: positions.filter((p) => ["CDM", "CM", "CAM"].includes(p.code)),
    attackers: positions.filter((p) => ["RW", "LW", "ST"].includes(p.code)),
  }

  const selectAllByType = (type: keyof typeof positionsByType) => {
    const currentIds = selectedPositions.map((p) => p.id)
    const typeIds = positionsByType[type].map((p) => p.id)
    const newPositions = [...selectedPositions, ...positionsByType[type].filter((p) => !currentIds.includes(p.id))]
    onPositionChange(newPositions)
  }

  const clearAllByType = (type: keyof typeof positionsByType) => {
    const typeIds = positionsByType[type].map((p) => p.id)
    const newPositions = selectedPositions.filter((p) => !typeIds.includes(p.id))
    onPositionChange(newPositions)
  }

  return (
    <Card className="bg-blue-900/60 backdrop-blur-sm border-blue-800/50 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full -ml-16 -mb-16 blur-3xl" />
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Filter className="mr-2 h-5 w-5 text-blue-300" />
          Position Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="positions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-blue-800/50 border border-blue-700/50 mb-4">
            <TabsTrigger
              value="positions"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
            >
              All Positions
            </TabsTrigger>
            <TabsTrigger
              value="defenders"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
            >
              Defenders
            </TabsTrigger>
            <TabsTrigger
              value="midfielders"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
            >
              Midfielders
            </TabsTrigger>
            <TabsTrigger
              value="attackers"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
            >
              Attackers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-white">Select positions to include in your squad</Label>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => onPositionChange(positions)}
                  >
                    Select All
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => onPositionChange([])}
                  >
                    Clear All
                  </Badge>
                </div>
              </div>

              {loading ? (
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="h-8 w-16 bg-blue-800/50 animate-pulse rounded-full"></div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {positions.map((position) => (
                    <motion.div key={position.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Badge
                        variant={selectedPositions.some((p) => p.id === position.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedPositions.some((p) => p.id === position.id)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "text-blue-300 hover:bg-blue-800/70 hover:text-white"
                        }`}
                        onClick={() => togglePosition(position)}
                      >
                        {position.code}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="defenders">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-white">Select defensive positions</Label>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => selectAllByType("defenders")}
                  >
                    Select All
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => clearAllByType("defenders")}
                  >
                    Clear All
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {positionsByType.defenders.map((position) => (
                  <motion.div key={position.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant={selectedPositions.some((p) => p.id === position.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedPositions.some((p) => p.id === position.id)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-blue-300 hover:bg-blue-800/70 hover:text-white"
                      }`}
                      onClick={() => togglePosition(position)}
                    >
                      {position.code}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="midfielders">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-white">Select midfield positions</Label>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => selectAllByType("midfielders")}
                  >
                    Select All
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => clearAllByType("midfielders")}
                  >
                    Clear All
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {positionsByType.midfielders.map((position) => (
                  <motion.div key={position.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant={selectedPositions.some((p) => p.id === position.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedPositions.some((p) => p.id === position.id)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-blue-300 hover:bg-blue-800/70 hover:text-white"
                      }`}
                      onClick={() => togglePosition(position)}
                    >
                      {position.code}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attackers">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-white">Select attacking positions</Label>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => selectAllByType("attackers")}
                  >
                    Select All
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-700 text-blue-300 hover:text-white"
                    onClick={() => clearAllByType("attackers")}
                  >
                    Clear All
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {positionsByType.attackers.map((position) => (
                  <motion.div key={position.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant={selectedPositions.some((p) => p.id === position.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedPositions.some((p) => p.id === position.id)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-blue-300 hover:bg-blue-800/70 hover:text-white"
                      }`}
                      onClick={() => togglePosition(position)}
                    >
                      {position.code}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {selectedPositions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-800/30 rounded-md border border-blue-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-blue-300">Selected Positions ({selectedPositions.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedPositions.map((position) => (
                <Badge key={position.id} className="bg-blue-700">
                  {position.code}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
