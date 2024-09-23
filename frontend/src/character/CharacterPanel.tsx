import { Heart, HeartOff, Coins, Star, TrendingUp } from "lucide-react"
import * as Progress from "@radix-ui/react-progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Character } from '@/utils/types';


const MAX_HEALTH = 10
const MAX_XP = 1000

export default function CharacterPanel(character: Character) {

    const renderHearts = () => {
        const hearts = []
        for (let i = 0; i < MAX_HEALTH; i++) {
            if (i < character.health / 10) {
                hearts.push(<Heart key={i} className="w-5 h-5 text-red-500" />)
            } else {
                hearts.push(<HeartOff key={i} className="w-5 h-5 text-gray-500" />)
            }
        }
        return hearts
    }

    return (
        <div className="w-64 p-4 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-lg">
            <div className="flex flex-col items-center mb-3">
                <h2 className="text-xl font-bold mb-2">{character.name}</h2>
                <Avatar className="w-16 h-16">
                    <AvatarImage src={""} alt={character.name} />
                    <AvatarFallback>{character.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>
            <div className="space-y-3">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Health</span>
                        <span className="text-sm font-medium">{character.health}/{MAX_HEALTH * 10}</span>
                    </div>
                    <div className="flex justify-between">
                        {renderHearts()}
                    </div>
                </div>
            
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                        <span className="text-sm font-medium">Coins</span>
                    </div>
                    <span className="text-sm font-medium">{character.coins}</span>
                </div>
            
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-blue-500" />
                            <span className="text-sm font-medium">XP</span>
                        </div>
                        <span className="text-sm font-medium">{character.xp}/{MAX_XP}</span>
                    </div>
                    <Progress.Root className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <Progress.Indicator
                            className="h-full bg-blue-500"
                            style={{ width: `${(character.xp / MAX_XP) * 100}%` }}
                        />
                    </Progress.Root>
                </div>
            
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        <span className="text-sm font-medium">Level</span>
                    </div>
                    <span className="text-sm font-medium">{character.level}</span>
                </div>
            </div>
        </div>
    )
}