"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BudgetForm } from "./budget-form"
import { PlayerFilters } from "./player-filters"
import { PlayerCombination } from "./player-combination"
import { usePlayerCombinations } from "@/hooks/use-player-combinations"
import type { Position } from "@/types/position"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Save } from "lucide-react"

export function AuctionAssistant() {
  const [budget, setBudget] = useState<number | null>(null)
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([])
  const { combinations, isLoading, error, refreshCombinations } = usePlayerCombinations(budget, selectedPositions)
  const [activeTab, setActiveTab] = useState("combination-1")

  const handleBudgetSubmit = (amount: number) => {
    setBudget(amount)
  }

  const handlePositionChange = (positions: Position[]) => {
    setSelectedPositions(positions)
  }

  const handleRefresh = () => {
    refreshCombinations()
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <BudgetForm onSubmit={handleBudgetSubmit} />
      </motion.div>

      {budget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PlayerFilters onPositionChange={handlePositionChange} selectedPositions={selectedPositions} />
        </motion.div>
      )}

      {budget && selectedPositions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-blue-900/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-blue-800/50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Suggested Player Combinations
              {budget && <span className="text-blue-300 ml-2">Budget: €{budget.toLocaleString()}</span>}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="bg-blue-800/50 border-blue-700 text-white hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-emerald-800/50 border-emerald-700 text-white hover:bg-emerald-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Squad
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-blue-300">Finding the best player combinations for your budget...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : combinations.length === 0 ? (
            <div className="text-blue-300 text-center py-8">
              No valid player combinations found matching your criteria. Try adjusting your budget or position filters.
            </div>
          ) : (
            <Tabs defaultValue="combination-1" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-blue-800/50 border border-blue-700/50">
                {combinations.map((_, index) => (
                  <TabsTrigger
                    key={`combination-${index + 1}`}
                    value={`combination-${index + 1}`}
                    className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300"
                  >
                    Option {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                {combinations.map((combination, index) => (
                  <TabsContent key={`combination-${index + 1}`} value={`combination-${index + 1}`} className="mt-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PlayerCombination combination={combination} budget={budget || 0} />
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </Tabs>
          )}
        </motion.div>
      )}
    </div>
  )
}
