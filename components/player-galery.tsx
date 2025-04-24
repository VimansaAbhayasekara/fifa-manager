"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GalleryCard } from "./gallery-card"
import type { Player } from "@/types/player"
import type { Position } from "@/types/position"

export function PlayerGallery() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [valueRange, setValueRange] = useState([0, 200])
  const [ratingRange, setRatingRange] = useState([60, 100])
  const [sortBy, setSortBy] = useState("rating-desc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchPlayers()
    fetchPositions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [players, searchQuery, activeTab, selectedPosition, valueRange, ratingRange, sortBy])

  async function fetchPlayers() {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("players")
        .select(`
          *,
          position:positions(*),
          club:clubs(*),
          country:countries(*)
        `)
        .order("overall_rating", { ascending: false })

      if (error) throw error

      setPlayers(data || [])
      setFilteredPlayers(data || [])
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPositions() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("positions").select("*").order("id")

      if (error) throw error

      setPositions(data || [])
    } catch (error) {
      console.error("Error fetching positions:", error)
    }
  }

  function applyFilters() {
    let result = [...players]

    // Search filter
    if (searchQuery) {
      result = result.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Position type filter
    if (activeTab !== "all") {
      const positionCodes: Record<string, string[]> = {
        defenders: ["GK", "RB", "CB", "LB"],
        midfielders: ["CDM", "CM", "CAM"],
        attackers: ["RW", "LW", "ST"],
      }

      result = result.filter((player) =>
        positionCodes[activeTab as keyof typeof positionCodes]?.includes(player.position?.code || ""),
      )
    }

    // Specific position filter
    if (selectedPosition) {
      result = result.filter((player) => player.position_id === selectedPosition)
    }

    // Value range filter
    result = result.filter((player) => {
      const valueInMillions = player.market_value / 1000000
      return valueInMillions >= valueRange[0] && valueInMillions <= valueRange[1]
    })

    // Rating range filter
    result = result.filter(
      (player) => player.overall_rating >= ratingRange[0] && player.overall_rating <= ratingRange[1],
    )

    // Sorting
    if (sortBy === "rating-desc") {
      result.sort((a, b) => b.overall_rating - a.overall_rating)
    } else if (sortBy === "rating-asc") {
      result.sort((a, b) => a.overall_rating - b.overall_rating)
    } else if (sortBy === "value-desc") {
      result.sort((a, b) => b.market_value - a.market_value)
    } else if (sortBy === "value-asc") {
      result.sort((a, b) => a.market_value - b.market_value)
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name))
    }

    setFilteredPlayers(result)
  }

  function resetFilters() {
    setSearchQuery("")
    setActiveTab("all")
    setSelectedPosition(null)
    setValueRange([0, 200])
    setRatingRange([60, 100])
    setSortBy("rating-desc")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
            <Input
              placeholder="Search players by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-blue-800/50 border-blue-700/50 text-white"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-blue-300 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-blue-800/50 border-blue-700/50 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-blue-900 border-blue-800">
              <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
              <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
              <SelectItem value="value-desc">Value (High to Low)</SelectItem>
              <SelectItem value="value-asc">Value (Low to High)</SelectItem>
              <SelectItem value="name-asc">Name (A to Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z to A)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-blue-900/60 backdrop-blur-sm border-blue-800/50 overflow-hidden p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Position Type</Label>
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="bg-blue-800/50 border border-blue-700/50 w-full">
                        <TabsTrigger
                          value="all"
                          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
                        >
                          All
                        </TabsTrigger>
                        <TabsTrigger
                          value="defenders"
                          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
                        >
                          DEF
                        </TabsTrigger>
                        <TabsTrigger
                          value="midfielders"
                          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
                        >
                          MID
                        </TabsTrigger>
                        <TabsTrigger
                          value="attackers"
                          className="flex-1 data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
                        >
                          ATT
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Specific Position</Label>
                    <Select
                      value={selectedPosition ? selectedPosition.toString() : "none"}
                      onValueChange={(value) =>
                        setSelectedPosition(value === "none" ? null : value ? Number.parseInt(value) : null)
                      }
                    >
                      <SelectTrigger className="bg-blue-800/50 border-blue-700/50 text-white">
                        <SelectValue placeholder="Any position" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-900 border-blue-800 max-h-[200px]">
                        <SelectItem value="none">Any position</SelectItem>
                        {positions.map((position) => (
                          <SelectItem key={position.id} value={position.id.toString()}>
                            {position.code} - {position.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-white">Market Value (€M)</Label>
                      <span className="text-blue-300 text-sm">
                        €{valueRange[0]}M - €{valueRange[1]}M
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 200]}
                      value={valueRange}
                      onValueChange={setValueRange}
                      min={0}
                      max={200}
                      step={5}
                      className="py-4"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-white">Player Rating</Label>
                      <span className="text-blue-300 text-sm">
                        {ratingRange[0]} - {ratingRange[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[60, 100]}
                      value={ratingRange}
                      onValueChange={setRatingRange}
                      min={60}
                      max={100}
                      step={1}
                      className="py-4"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="w-full bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">{filteredPlayers.length} Players Found</h2>
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge className="bg-blue-700 px-3 py-1">
              Search: {searchQuery}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 text-blue-200 hover:text-white hover:bg-transparent"
                onClick={() => setSearchQuery("")}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {activeTab !== "all" && (
            <Badge className="bg-blue-700 px-3 py-1">
              Type: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 text-blue-200 hover:text-white hover:bg-transparent"
                onClick={() => setActiveTab("all")}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {selectedPosition && (
            <Badge className="bg-blue-700 px-3 py-1">
              Position: {positions.find((p) => p.id === selectedPosition)?.code || ""}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 text-blue-200 hover:text-white hover:bg-transparent"
                onClick={() => setSelectedPosition(null)}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="h-[360px] bg-blue-800/30 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-900/60 backdrop-blur-sm border border-blue-800/50 rounded-lg p-8 inline-block"
          >
            <h3 className="text-xl font-bold text-white mb-2">No Players Found</h3>
            <p className="text-blue-300 mb-4">Try adjusting your filters to see more results.</p>
            <Button onClick={resetFilters} className="bg-blue-700 hover:bg-blue-600">
              Reset All Filters
            </Button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredPlayers.map((player) => (
            <GalleryCard key={player.id} player={player} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
