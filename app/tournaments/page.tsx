import { Tournaments } from "@/components/tournaments"
import { StadiumBackground } from "@/components/stadium-background"

export default function TournamentsPage() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      <StadiumBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-glow">Tournaments</h1>
        <Tournaments />
      </div>
    </main>
  )
}
