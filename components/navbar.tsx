"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Trophy, Dumbbell, Settings } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "HOME", path: "/", icon: Home },
    { name: "AUCTION", path: "/auction-assistant", icon: Users },
    { name: "TOURNAMENTS", path: "/tournaments", icon: Trophy },
    { name: "SKILL GAMES", path: "/skill-games", icon: Dumbbell },
    { name: "MANAGEMENT", path: "/player-management", icon: Settings },
  ]

  return (
    <nav className="bg-blue-900/80 backdrop-blur-sm border-b border-blue-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-white bg-blue-800 border-b-2 border-blue-400"
                      : "text-blue-100 hover:text-white hover:bg-blue-800/50",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-md px-3 py-1 flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                EA
              </div>
              <span className="text-white text-sm">FIFA MANAGER</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
