"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Player } from "@/types/player"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

export function PlayerManagement() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchPlayers()
  }, [])

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
        .order("name")

      if (error) throw error

      setPlayers(data || [])
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch

    const positionCode = player.position?.code || ""

    if (activeTab === "defenders") {
      return matchesSearch && ["GK", "RB", "CB", "LB"].includes(positionCode)
    }

    if (activeTab === "midfielders") {
      return matchesSearch && ["CDM", "CM", "CAM"].includes(positionCode)
    }

    if (activeTab === "attackers") {
      return matchesSearch && ["RW", "LW", "ST"].includes(positionCode)
    }

    return matchesSearch
  })

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-blue-900/60 backdrop-blur-sm border-blue-800/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="mr-2 h-5 w-5 text-blue-300" />
              Player Management
            </CardTitle>
            <CardDescription>Add, edit, and manage players in your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-blue-800/50 border-blue-700/50 text-white"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Player
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-blue-900 border-blue-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Player</DialogTitle>
                    <DialogDescription>Fill in the details to add a new player to the database.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Player Name</Label>
                        <Input id="name" className="bg-blue-800 border-blue-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" className="bg-blue-800 border-blue-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-800 border-blue-700">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent className="bg-blue-900 border-blue-800">
                            <SelectItem value="1">Goalkeeper (GK)</SelectItem>
                            <SelectItem value="2">Right Back (RB)</SelectItem>
                            <SelectItem value="3">Center Back (CB)</SelectItem>
                            {/* More positions */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="club">Club</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-800 border-blue-700">
                            <SelectValue placeholder="Select club" />
                          </SelectTrigger>
                          <SelectContent className="bg-blue-900 border-blue-800">
                            <SelectItem value="1">Barcelona</SelectItem>
                            <SelectItem value="2">Real Madrid</SelectItem>
                            <SelectItem value="3">Manchester City</SelectItem>
                            {/* More clubs */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-800 border-blue-700">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="bg-blue-900 border-blue-800">
                            <SelectItem value="1">Argentina</SelectItem>
                            <SelectItem value="2">Portugal</SelectItem>
                            <SelectItem value="3">Brazil</SelectItem>
                            {/* More countries */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Market Value (€)</Label>
                        <Input id="value" type="number" className="bg-blue-800 border-blue-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input id="image_url" className="bg-blue-800 border-blue-700" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pace">Pace</Label>
                        <Input id="pace" type="number" min="1" max="99" className="bg-blue-800 border-blue-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dribbling">Dribbling</Label>
                        <Input id="dribbling" type="number" min="1" max="99" className="bg-blue-800 border-blue-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shooting">Shooting</Label>
                        <Input id="shooting" type="number" min="1" max="99" className="bg-blue-800 border-blue-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="defending">Defending</Label>
                        <Input id="defending" type="number" min="1" max="99" className="bg-blue-800 border-blue-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passing">Passing</Label>
                        <Input id="passing" type="number" min="1" max="99" className="bg-blue-800 border-blue-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="physical">Physical</Label>
                        <Input id="physical" type="number" min="1" max="99" className="bg-blue-800 border-blue-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overall_rating">Overall Rating</Label>
                      <Input
                        id="overall_rating"
                        type="number"
                        min="1"
                        max="99"
                        className="bg-blue-800 border-blue-700"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                    >
                      Add Player
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-blue-800/50 border border-blue-700/50 mb-4">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
                >
                  All Players
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

              <div className="rounded-md border border-blue-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-blue-800/50">
                    <TableRow className="hover:bg-blue-800/80 border-blue-700">
                      <TableHead className="text-blue-300">Name</TableHead>
                      <TableHead className="text-blue-300">Position</TableHead>
                      <TableHead className="text-blue-300">Club</TableHead>
                      <TableHead className="text-blue-300">Age</TableHead>
                      <TableHead className="text-blue-300">Rating</TableHead>
                      <TableHead className="text-blue-300">Value</TableHead>
                      <TableHead className="text-blue-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index} className="hover:bg-blue-800/30 border-blue-700/50">
                          <TableCell className="font-medium">
                            <div className="h-4 bg-blue-800/50 animate-pulse rounded-md w-32"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-blue-800/50 animate-pulse rounded-md w-10"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-blue-800/50 animate-pulse rounded-md w-24"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-blue-800/50 animate-pulse rounded-md w-8"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-blue-800/50 animate-pulse rounded-md w-8"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-blue-800/50 animate-pulse rounded-md w-16"></div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="h-8 bg-blue-800/50 animate-pulse rounded-md w-20 ml-auto"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredPlayers.length === 0 ? (
                      <TableRow className="hover:bg-blue-800/30 border-blue-700/50">
                        <TableCell colSpan={7} className="text-center text-blue-300 py-8">
                          No players found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlayers.map((player) => (
                        <TableRow key={player.id} className="hover:bg-blue-800/30 border-blue-700/50">
                          <TableCell className="font-medium text-white">{player.name}</TableCell>
                          <TableCell className="text-blue-300">{player.position?.code || "N/A"}</TableCell>
                          <TableCell className="text-blue-300">{player.club?.name || "N/A"}</TableCell>
                          <TableCell className="text-blue-300">{player.age}</TableCell>
                          <TableCell className="text-blue-300">{player.overall_rating}</TableCell>
                          <TableCell className="text-emerald-400">
                            €{(player.market_value / 1000000).toFixed(1)}M
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-blue-800/50 border-blue-700 text-blue-300 hover:text-white hover:bg-blue-700"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-red-900/30 border-red-800/50 text-red-300 hover:text-white hover:bg-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
