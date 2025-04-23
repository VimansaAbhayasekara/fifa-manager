"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Euro, Coins } from "lucide-react"

interface BudgetFormProps {
  onSubmit: (budget: number) => void
}

export function BudgetForm({ onSubmit }: BudgetFormProps) {
  const [budget, setBudget] = useState("100000000")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const budgetValue = Number.parseFloat(budget)

    if (isNaN(budgetValue) || budgetValue <= 0) {
      setError("Please enter a valid budget amount")
      return
    }

    setError("")
    onSubmit(budgetValue)
  }

  const handleSliderChange = (value: number[]) => {
    setBudget(value[0].toString())
  }

  return (
    <Card className="bg-blue-900/60 backdrop-blur-sm border-blue-800/50 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Coins className="mr-2 h-5 w-5 text-blue-300" />
          Set Your Transfer Budget
        </CardTitle>
        <CardDescription>Enter your total transfer budget to get optimal player combinations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-white">
                Transfer Budget (€)
              </Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <Input
                  id="budget"
                  type="number"
                  placeholder="100000000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-10 bg-blue-800/50 border-blue-700/50 text-white"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-blue-300">
                <span>€10M</span>
                <span>€100M</span>
                <span>€200M</span>
                <span>€300M</span>
              </div>
              <Slider
                defaultValue={[100000000]}
                min={10000000}
                max={300000000}
                step={5000000}
                value={[Number(budget)]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white border-none"
            >
              Find Optimal Player Combinations
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}
