import { CalendarIcon, CheckCircle2, Star, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Character, Habit, HabitAction } from "@/utils/types"
import { Dispatch, SetStateAction, useMemo } from "react"

type HabitPanelProps = {
    habit: Habit
    dispatchHabits: Dispatch<HabitAction>
    setCharacter: Dispatch<SetStateAction<Character>>
}

export default function HabitPanel({habit, dispatchHabits, setCharacter}: HabitPanelProps) {
    const today = useMemo(() => new Date().toISOString().split('T')[0], [])
    const isCompletedToday = useMemo(() => habit.dates.includes(today), [habit.dates, today])

    const completeHabit = async () => {
        if (!isCompletedToday) {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/character/ted/habit/complete", {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ 
                        name: habit.name,
                        date: today
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to complete habit')
                }

                const data = await response.json()
                setCharacter(data)
                dispatchHabits({
                    type: "completed",
                    habit: habit.name,
                    date: today
                })
            }
            catch (error) {
                console.error("Error completing habit:", error)
            }
        }
    }

    const renderCalendar = () => {
        const today_date = new Date()
        const currentMonth = today_date.getMonth()
        const currentYear = today_date.getFullYear()
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

        const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(currentYear, currentMonth, i + 1)
            const dateString = date.toISOString().split('T')[0]
            const isCompleted = habit.dates.includes(dateString)
            return (
                <div
                    key={i}
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                        isCompleted ? "bg-green-500 text-gray-800" : "bg-gray-700 text-gray-300"
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

    if (!habit) {
        return <div className="text-gray-400">No habit data available</div>
    }

    return (
        <Card className="border-none w-64 bg-gray-700 bg-opacity-90 text-white rounded-lg shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xl">
                    <span>{habit.name}</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={completeHabit} 
                                    className={`p-2 border-none ${
                                        isCompletedToday
                                            ? "bg-green-500/20 text-green-300 hover:bg-green-500/20 hover:text-green-300 cursor-default"
                                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 hover:text-gray-100"
                                        }`}
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Complete habit for today</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="text-sm font-medium">XP Gain</span>
                    </div>
                    <span className="text-sm font-medium">+{habit.xp_gain}</span>
                </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                        <span className="text-sm font-medium">Coin Loss (if skipped)</span>
                    </div>
                    <span className="text-sm font-medium text-red-400">-{habit.coin_loss}</span>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Completion Calendar</span>
                    </div>
                    {renderCalendar()}
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-gray-400">
                    Completed {habit.dates.length}
                </p>
            </CardFooter>
        </Card>
    )
}