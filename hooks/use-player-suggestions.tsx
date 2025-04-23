"use client"

import { useEffect, useState } from "react"
import type { Player } from "@/types/player"
import type { Position } from "@/types/position"
import { createClient } from "@/lib/supabase/client"

export function usePlayerSuggestions(budget: number | null, selectedPositions: Position[]) {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlayers() {
      if (!budget) {
        setPlayers([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        let query = supabase
          .from("players")
          .select(`
            *,
            position:positions(*),
            club:clubs(*),
            country:countries(*)
          `)
          .lte("market_value", budget)
          .order("overall_rating", { ascending: false })

        // Filter by positions if any are selected
        if (selectedPositions.length > 0) {
          const positionIds = selectedPositions.map((p) => p.id)
          query = query.in("position_id", positionIds)
        }

        // Limit to top 8 players
        query = query.limit(8)

        const { data, error } = await query

        if (error) throw error

        setPlayers(data || [])
      } catch (err) {
        console.error("Error fetching players:", err)
        setError("Failed to fetch player suggestions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [budget, selectedPositions])

  return { players, isLoading, error }
}
