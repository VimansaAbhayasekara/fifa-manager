"use client"

import type React from "react"

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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import type { Player } from "@/types/player"
import type { Position } from "@/types/position"
import type { Club } from "@/types/club"
import type { Country } from "@/types/country"
import { Plus, Pencil, Trash2, Search, RefreshCw } from "lucide-react"

interface PlayerFormData {
  name: string
  age: number
  position_id: number
  club_id: number
  country_id: number
  market_value: number
  image_url: string
  pace: number
  dribbling: number
  shooting: number
  defending: number
  passing: number
  physical: number
  overall_rating: number
}

export function PlayerManagement() {
  const [players, setPlayers] = useState<Player[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null)
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null)
  const [formData, setFormData] = useState<PlayerFormData>({
    name: "",
    age: 20,
    position_id: 0,
    club_id: 0,
    country_id: 0,
    market_value: 1000000,
    image_url: "",
    pace: 70,
    dribbling: 70,
    shooting: 70,
    defending: 70,
    passing: 70,
    physical: 70,
    overall_rating: 70,
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PlayerFormData, string>>>({})

  useEffect(() => {
    fetchPlayers()
    fetchPositions()
    fetchClubs()
    fetchCountries()
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
      toast({
        title: "Error",
        description: "Failed to fetch players. Please try again.",
        variant: "destructive",
      })
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

  async function fetchClubs() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("clubs").select("*").order("name")

      if (error) throw error

      setClubs(data || [])
    } catch (error) {
      console.error("Error fetching clubs:", error)
    }
  }

  async function fetchCountries() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("countries").select("*").order("name")

      if (error) throw error

      setCountries(data || [])
    } catch (error) {
      console.error("Error fetching countries:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]:
        id === "age" ||
        id === "pace" ||
        id === "dribbling" ||
        id === "shooting" ||
        id === "defending" ||
        id === "passing" ||
        id === "physical" ||
        id === "overall_rating" ||
        id === "market_value"
          ? Number(value)
          : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: Number(value),
    })
  }

  const validateForm = () => {
    const errors: Partial<Record<keyof PlayerFormData, string>> = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.position_id) errors.position_id = "Position is required"
    if (!formData.club_id) errors.club_id = "Club is required"
    if (!formData.country_id) errors.country_id = "Country is required"
    if (formData.age < 15 || formData.age > 45) errors.age = "Age must be between 15 and 45"
    if (formData.market_value <= 0) errors.market_value = "Market value must be greater than 0"

    const statFields = ["pace", "dribbling", "shooting", "defending", "passing", "physical", "overall_rating"]
    statFields.forEach((field) => {
      const value = formData[field as keyof PlayerFormData] as number
      if (value < 1 || value > 99) errors[field as keyof PlayerFormData] = "Value must be between 1 and 99"
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddPlayer = async () => {
    if (!validateForm()) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("players")
        .insert([formData])
        .select(`
          *,
          position:positions(*),
          club:clubs(*),
          country:countries(*)
        `)
        .single()

      if (error) throw error

      setPlayers([...players, data])
      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Success",
        description: "Player added successfully",
      })
    } catch (error) {
      console.error("Error adding player:", error)
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditPlayer = (player: Player) => {
    setPlayerToEdit(player)
    setFormData({
      name: player.name,
      age: player.age,
      position_id: player.position_id,
      club_id: player.club_id,
      country_id: player.country_id,
      market_value: player.market_value,
      image_url: player.image_url || "",
      pace: player.pace,
      dribbling: player.dribbling,
      shooting: player.shooting,
      defending: player.defending,
      passing: player.passing,
      physical: player.physical,
      overall_rating: player.overall_rating,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePlayer = async () => {
    if (!playerToEdit || !validateForm()) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("players")
        .update(formData)
        .eq("id", playerToEdit.id)
        .select(`
          *,
          position:positions(*),
          club:clubs(*),
          country:countries(*)
        `)
        .single()

      if (error) throw error

      setPlayers(players.map((p) => (p.id === playerToEdit.id ? data : p)))
      setIsEditDialogOpen(false)
      resetForm()
      toast({
        title: "Success",
        description: "Player updated successfully",
      })
    } catch (error) {
      console.error("Error updating player:", error)
      toast({
        title: "Error",
        description: "Failed to update player. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlayer = (player: Player) => {
    setPlayerToDelete(player)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePlayer = async () => {
    if (!playerToDelete) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("players").delete().eq("id", playerToDelete.id)

      if (error) throw error

      setPlayers(players.filter((p) => p.id !== playerToDelete.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Player deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting player:", error)
      toast({
        title: "Error",
        description: "Failed to delete player. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      age: 20,
      position_id: 0,
      club_id: 0,
      country_id: 0,
      market_value: 1000000,
      image_url: "",
      pace: 70,
      dribbling: 70,
      shooting: 70,
      defending: 70,
      passing: 70,
      physical: 70,
      overall_rating: 70,
    })
    setFormErrors({})
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
              <Button
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Player
              </Button>
              <Button
                onClick={fetchPlayers}
                variant="outline"
                className="bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
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
                                onClick={() => handleEditPlayer(player)}
                                className="h-8 w-8 bg-blue-800/50 border-blue-700 text-blue-300 hover:text-white hover:bg-blue-700"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeletePlayer(player)}
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

      {/* Add Player Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-blue-900 border-blue-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
            <DialogDescription>Fill in the details to add a new player to the database.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Player Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.name ? "border-red-500" : ""}`}
                />
                {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.age ? "border-red-500" : ""}`}
                />
                {formErrors.age && <p className="text-red-500 text-xs">{formErrors.age}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position_id ? formData.position_id.toString() : ""}
                  onValueChange={(value) => handleSelectChange("position_id", value)}
                >
                  <SelectTrigger
                    className={`bg-blue-800 border-blue-700 ${formErrors.position_id ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-800">
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id.toString()}>
                        {position.code} - {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.position_id && <p className="text-red-500 text-xs">{formErrors.position_id}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="club">Club</Label>
                <Select
                  value={formData.club_id ? formData.club_id.toString() : ""}
                  onValueChange={(value) => handleSelectChange("club_id", value)}
                >
                  <SelectTrigger
                    className={`bg-blue-800 border-blue-700 ${formErrors.club_id ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select club" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-800 max-h-[200px]">
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id.toString()}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.club_id && <p className="text-red-500 text-xs">{formErrors.club_id}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country_id ? formData.country_id.toString() : ""}
                  onValueChange={(value) => handleSelectChange("country_id", value)}
                >
                  <SelectTrigger
                    className={`bg-blue-800 border-blue-700 ${formErrors.country_id ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-800 max-h-[200px]">
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.country_id && <p className="text-red-500 text-xs">{formErrors.country_id}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_value">Market Value (€)</Label>
                <Input
                  id="market_value"
                  type="number"
                  value={formData.market_value}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.market_value ? "border-red-500" : ""}`}
                />
                {formErrors.market_value && <p className="text-red-500 text-xs">{formErrors.market_value}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="bg-blue-800 border-blue-700"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pace">Pace</Label>
                <Input
                  id="pace"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.pace}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.pace ? "border-red-500" : ""}`}
                />
                {formErrors.pace && <p className="text-red-500 text-xs">{formErrors.pace}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dribbling">Dribbling</Label>
                <Input
                  id="dribbling"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.dribbling}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.dribbling ? "border-red-500" : ""}`}
                />
                {formErrors.dribbling && <p className="text-red-500 text-xs">{formErrors.dribbling}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shooting">Shooting</Label>
                <Input
                  id="shooting"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.shooting}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.shooting ? "border-red-500" : ""}`}
                />
                {formErrors.shooting && <p className="text-red-500 text-xs">{formErrors.shooting}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defending">Defending</Label>
                <Input
                  id="defending"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.defending}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.defending ? "border-red-500" : ""}`}
                />
                {formErrors.defending && <p className="text-red-500 text-xs">{formErrors.defending}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passing">Passing</Label>
                <Input
                  id="passing"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.passing}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.passing ? "border-red-500" : ""}`}
                />
                {formErrors.passing && <p className="text-red-500 text-xs">{formErrors.passing}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="physical">Physical</Label>
                <Input
                  id="physical"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.physical}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.physical ? "border-red-500" : ""}`}
                />
                {formErrors.physical && <p className="text-red-500 text-xs">{formErrors.physical}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overall_rating">Overall Rating</Label>
              <Input
                id="overall_rating"
                type="number"
                min="1"
                max="99"
                value={formData.overall_rating}
                onChange={handleInputChange}
                className={`bg-blue-800 border-blue-700 ${formErrors.overall_rating ? "border-red-500" : ""}`}
              />
              {formErrors.overall_rating && <p className="text-red-500 text-xs">{formErrors.overall_rating}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="bg-blue-800/50 border-blue-700 text-white hover:bg-blue-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleAddPlayer}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              Add Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-blue-900 border-blue-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Player: {playerToEdit?.name}</DialogTitle>
            <DialogDescription>Update player information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Player Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.name ? "border-red-500" : ""}`}
                />
                {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.age ? "border-red-500" : ""}`}
                />
                {formErrors.age && <p className="text-red-500 text-xs">{formErrors.age}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position_id ? formData.position_id.toString() : ""}
                  onValueChange={(value) => handleSelectChange("position_id", value)}
                >
                  <SelectTrigger
                    className={`bg-blue-800 border-blue-700 ${formErrors.position_id ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-800">
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id.toString()}>
                        {position.code} - {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.position_id && <p className="text-red-500 text-xs">{formErrors.position_id}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="club">Club</Label>
                <Select
                  value={formData.club_id ? formData.club_id.toString() : ""}
                  onValueChange={(value) => handleSelectChange("club_id", value)}
                >
                  <SelectTrigger
                    className={`bg-blue-800 border-blue-700 ${formErrors.club_id ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select club" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-800 max-h-[200px]">
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id.toString()}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.club_id && <p className="text-red-500 text-xs">{formErrors.club_id}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country_id ? formData.country_id.toString() : ""}
                  onValueChange={(value) => handleSelectChange("country_id", value)}
                >
                  <SelectTrigger
                    className={`bg-blue-800 border-blue-700 ${formErrors.country_id ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-800 max-h-[200px]">
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.country_id && <p className="text-red-500 text-xs">{formErrors.country_id}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="market_value">Market Value (€)</Label>
                <Input
                  id="market_value"
                  type="number"
                  value={formData.market_value}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.market_value ? "border-red-500" : ""}`}
                />
                {formErrors.market_value && <p className="text-red-500 text-xs">{formErrors.market_value}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="bg-blue-800 border-blue-700"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pace">Pace</Label>
                <Input
                  id="pace"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.pace}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.pace ? "border-red-500" : ""}`}
                />
                {formErrors.pace && <p className="text-red-500 text-xs">{formErrors.pace}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dribbling">Dribbling</Label>
                <Input
                  id="dribbling"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.dribbling}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.dribbling ? "border-red-500" : ""}`}
                />
                {formErrors.dribbling && <p className="text-red-500 text-xs">{formErrors.dribbling}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shooting">Shooting</Label>
                <Input
                  id="shooting"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.shooting}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.shooting ? "border-red-500" : ""}`}
                />
                {formErrors.shooting && <p className="text-red-500 text-xs">{formErrors.shooting}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defending">Defending</Label>
                <Input
                  id="defending"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.defending}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.defending ? "border-red-500" : ""}`}
                />
                {formErrors.defending && <p className="text-red-500 text-xs">{formErrors.defending}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passing">Passing</Label>
                <Input
                  id="passing"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.passing}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.passing ? "border-red-500" : ""}`}
                />
                {formErrors.passing && <p className="text-red-500 text-xs">{formErrors.passing}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="physical">Physical</Label>
                <Input
                  id="physical"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.physical}
                  onChange={handleInputChange}
                  className={`bg-blue-800 border-blue-700 ${formErrors.physical ? "border-red-500" : ""}`}
                />
                {formErrors.physical && <p className="text-red-500 text-xs">{formErrors.physical}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overall_rating">Overall Rating</Label>
              <Input
                id="overall_rating"
                type="number"
                min="1"
                max="99"
                value={formData.overall_rating}
                onChange={handleInputChange}
                className={`bg-blue-800 border-blue-700 ${formErrors.overall_rating ? "border-red-500" : ""}`}
              />
              {formErrors.overall_rating && <p className="text-red-500 text-xs">{formErrors.overall_rating}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-blue-800/50 border-blue-700 text-white hover:bg-blue-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpdatePlayer}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-blue-900 border-blue-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {playerToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-blue-800/50 border-blue-700 text-white hover:bg-blue-700"
            >
              Cancel
            </Button>
            <Button onClick={confirmDeletePlayer} className="bg-red-700 hover:bg-red-800">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
