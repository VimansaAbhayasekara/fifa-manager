"use client"

import { useEffect, useState, useCallback } from "react"
import type { Player } from "@/types/player"
import type { Position } from "@/types/position"
import type { PlayerCombinationType } from "@/types/player-combination"
import { createClient } from "@/lib/supabase/client"

export function usePlayerCombinations(budget: number | null, selectedPositions: Position[]) {
  const [combinations, setCombinations] = useState<PlayerCombinationType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findOptimalCombinations = useCallback(async () => {
    if (!budget || selectedPositions.length === 0) {
      setCombinations([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get all players for the selected positions
      const positionIds = selectedPositions.map((p) => p.id)

      const { data: players, error: playersError } = await supabase
        .from("players")
        .select(`
          *,
          position:positions(*),
          club:clubs(*),
          country:countries(*)
        `)
        .in("position_id", positionIds)
        .order("overall_rating", { ascending: false })

      if (playersError) throw playersError

      if (!players || players.length === 0) {
        setCombinations([])
        setIsLoading(false)
        return
      }

      // Group players by position
      const playersByPosition = positionIds.reduce<Record<number, Player[]>>((acc, posId) => {
        acc[posId] = players.filter((p) => p.position_id === posId)
        return acc
      }, {})

      // Generate combinations using a knapsack-like algorithm
      const generatedCombinations = generatePlayerCombinations(playersByPosition, budget, positionIds)

      setCombinations(generatedCombinations)
    } catch (err) {
      console.error("Error finding optimal combinations:", err)
      setError("Failed to find optimal player combinations")
    } finally {
      setIsLoading(false)
    }
  }, [budget, selectedPositions])

  const generatePlayerCombinations = (
    playersByPosition: Record<number, Player[]>,
    maxBudget: number,
    positionIds: number[],
  ): PlayerCombinationType[] => {
    // This is a simplified algorithm to generate player combinations
    // In a real app, you'd use a more sophisticated algorithm like knapsack

    const combinations: PlayerCombinationType[] = []

    // Generate 3 different combinations
    for (let i = 0; i < 3; i++) {
      let remainingBudget = maxBudget
      const selectedPlayers: Player[] = []

      // For each position, select a player
      for (const posId of positionIds) {
        const positionPlayers = playersByPosition[posId]
        if (!positionPlayers || positionPlayers.length === 0) continue

        // For variety, select different players for different combinations
        // Use a weighted random selection based on rating and remaining budget
        const eligiblePlayers = positionPlayers.filter((p) => p.market_value <= remainingBudget)
        if (eligiblePlayers.length === 0) continue

        // For first combination, prefer highest rated players
        // For second, balance between rating and value
        // For third, optimize for value
        let selectedPlayer: Player | undefined

        if (i === 0) {
          // Highest rated players first
          selectedPlayer = eligiblePlayers[0]
        } else if (i === 1) {
          // Balance between rating and value
          const middleIndex = Math.floor(eligiblePlayers.length / 2)
          selectedPlayer = eligiblePlayers[middleIndex < eligiblePlayers.length ? middleIndex : 0]
        } else {
          // Best value (rating per cost)
          selectedPlayer = eligiblePlayers
            .map((p) => ({
              player: p,
              valueRatio: p.overall_rating / p.market_value,
            }))
            .sort((a, b) => b.valueRatio - a.valueRatio)[0]?.player
        }

        if (selectedPlayer) {
          selectedPlayers.push(selectedPlayer)
          remainingBudget -= selectedPlayer.market_value
        }
      }

      if (selectedPlayers.length > 0) {
        combinations.push({
          id: i + 1,
          players: selectedPlayers,
          totalValue: selectedPlayers.reduce((sum, p) => sum + p.market_value, 0),
          averageRating: selectedPlayers.reduce((sum, p) => sum + p.overall_rating, 0) / selectedPlayers.length,
        })
      }
    }

    // Sort combinations by average rating
    return combinations.sort((a, b) => b.averageRating - a.averageRating)
  }

  const refreshCombinations = useCallback(() => {
    findOptimalCombinations()
  }, [findOptimalCombinations])

  useEffect(() => {
    findOptimalCombinations()
  }, [findOptimalCombinations])

  return { combinations, isLoading, error, refreshCombinations }
}
