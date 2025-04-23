import { AuctionAssistant } from "@/components/auction-assistant"
import { StadiumBackground } from "@/components/stadium-background"

export default function AuctionAssistantPage() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      <StadiumBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-glow">Manager Auction Assistant</h1>
        <AuctionAssistant />
      </div>
    </main>
  )
}
