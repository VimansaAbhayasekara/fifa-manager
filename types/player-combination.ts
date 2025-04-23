import type { Player } from "./player"

export interface PlayerCombinationType {
  id: number
  players: Player[]
  totalValue: number
  averageRating: number
}
