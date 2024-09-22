export type Skill = {
    xp: number
    level: number
}

export type BadHabit = {
    name: string
    hp_loss: number
    dates: Date[]
}

export type Habit = {
    name: string
    xp_gain: number
    coin_loss: number
    dates: Date[]
}

export type Character = {
    name: string
    health: number
    coins: number
    xp: number
    level: number
    skills: Skill[]
    bad_habits: BadHabit[],
    habits: Habit[]
}