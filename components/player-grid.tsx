import { PlayerCard } from "./player-card"
import type { Player } from "@/types/player"

export function PlayerGrid({ players }: { players: Player[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
