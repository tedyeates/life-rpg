import { useEffect, useState } from 'react';
import './App.css'
import CharacterPanel from './character/CharacterPanel'
import { Character } from './utils/types';
import HabitPanel from './habits/HabitPanel';

function App() {
    const [character, setCharacter] = useState<Character>({
        name: "",
        health: 100,
        coins: 0,
        xp: 0,
        level: 0,
        skills: [],
        bad_habits: [],
        habits: []
    });
    
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/character/ted')
        .then(response => response.json())
        .then(data => setCharacter(data))
        .catch(error => console.error(error));
    }, []);
    
    return (
        <>
            <div className="flex justify-start items-start">
                <CharacterPanel character={character} />
                <HabitPanel />
            </div>
        </>
    )
}

export default App
