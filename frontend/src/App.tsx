import { useEffect, useReducer, useState } from 'react';
import './App.css'
import CharacterPanel from './character/CharacterPanel'
import { BadHabit, Character, GenericHabitAction, Habit } from './utils/types';
import HabitPanel from './habits/HabitPanel';
import { badHabitToGenericHabit, habitToGenericHabit } from './utils/conversion';

function App() {
    const [character, setCharacter] = useState<Character>({
        name: "",
        health: 100,
        coins: 0,
        xp: 0,
        level: 0,
        skills: {},
        bad_habits: {},
        habits: {}
    })

    const habitReducer = (state: { [key: string]: Habit | BadHabit }, action: GenericHabitAction) => {
        if (action.type === "completed" && action.habit && action.date) {
            return {
                ...state,
                [action.habit]: {
                    ...state[action.habit],
                    dates: [...state[action.habit].dates, action.date]
                }
            }
        }

        if (action.type === "set" && action.habits) {
            return action.habits
        }
        
        throw Error('Unknown action')
    }

    const [habits, dispatchHabits] = useReducer(habitReducer, {})
    const [badHabits, dispatchBadHabits] = useReducer(habitReducer, {})
    
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/character/ted')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setCharacter(data)
                dispatchHabits({ type: "set", habits: data.habits})
                dispatchBadHabits({ type: "set", habits: data.bad_habits})
            })
            .catch(error => console.error(error));
    }, []);
    
    return (
        <>
            <div className="flex justify-start items-start flex-col">
                <div className="flex justify-start items-start p-2">
                    <CharacterPanel {...character} />
                </div>
                <div className="flex justify-start items-start p-2 gap-4">
                    <div className="flex justify-start items-start p-2 gap-4">
                        {Object.values(habits).map((habit) => (
                            <HabitPanel 
                                key={habit.name} 
                                habit={habitToGenericHabit(habit as Habit)} 
                                dispatchHabits={dispatchHabits} 
                                setCharacter={setCharacter}
                            />
                        ))}
                    </div>
                    <div className="flex justify-start items-start p-2 gap-4">
                        {Object.values(badHabits).map((badHabit) => (
                            <HabitPanel 
                                key={badHabit.name} 
                                is_bad
                                habit={badHabitToGenericHabit(badHabit as BadHabit)} 
                                dispatchHabits={dispatchBadHabits} 
                                setCharacter={setCharacter}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
