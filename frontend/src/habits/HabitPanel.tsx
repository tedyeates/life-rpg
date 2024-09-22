"use client"

import { useState } from "react"
import { CalendarIcon, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Habit {
  id: number
  name: string
  xpGain: number
  coinLoss: number
  completedDates: string[]
}

export default function HabitPanel() {
    const [habit, setHabit] = useState<Habit>({
        id: 1,
        name: "Daily Exercise",
        xpGain: 50,
        coinLoss: 10,
        completedDates: ["2023-06-01", "2023-06-03", "2023-06-05", "2023-06-07"]
    })

    const completeHabit = () => {
        const today = new Date().toISOString().split('T')[0]
        if (!habit.completedDates.includes(today)) {
            setHabit(prevHabit => ({
                ...prevHabit,
                completedDates: [...prevHabit.completedDates, today]
            }))
        }
    }

    const renderCalendar = () => {
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

        const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1)
        const dateString = date.toISOString().split('T')[0]
        const isCompleted = habit.completedDates.includes(dateString)
        return (
            <div
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
                isCompleted ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
            >
            {i + 1}
            </div>
        )
        })

        return (
        <div className="grid grid-cols-7 gap-1 mt-2">
            {calendarDays}
        </div>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{habit.name}</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={completeHabit}>
                                <CheckCircle2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Complete habit for today</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +{habit.xpGain} XP for completion
                    </Badge>
                </div>
                    <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                        -{habit.coinLoss} Coins if skipped
                        </Badge>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-500">Completion Calendar</span>
                    </div>
                    {renderCalendar()}
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-gray-500">
                    Completed {habit.completedDates.length} times this month
                </p>
            </CardFooter>
        </Card>
    )
}