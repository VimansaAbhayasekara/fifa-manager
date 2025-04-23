import type { Position } from "./position"
import type { Club } from "./club"
import type { Country } from "./country"

export interface Player {
  id: number
  name: string
  age: number
  position_id: number
  position?: Position
  club_id: number
  club?: Club
  country_id: number
  country?: Country
  market_value: number
  image_url: string | null
  pace: number
  dribbling: number
  shooting: number
  defending: number
  passing: number
  physical: number
  overall_rating: number
  created_at: string
}
