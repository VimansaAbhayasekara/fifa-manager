import { HomeMenu } from "@/components/home-menu"
import { StadiumBackground } from "@/components/stadium-background"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      <StadiumBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <HomeMenu />
      </div>
    </main>
  )
}
