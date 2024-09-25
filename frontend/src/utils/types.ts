export type Skill = {
    xp: number
    level: number
}

export type GenericHabit = {
    name: string
    stat: number
    coin_loss?: number
    dates: string[]
}

export type BadHabit = {
    name: string
    hp_loss: number
    dates: string[]
}

export type Habit = {
    name: string
    xp_gain: number
    coin_loss: number
    dates: string[]
}

export type Character = {
    name: string
    health: number
    coins: number
    xp: number
    level: number
    skills: {
        [key: string]: Skill
    }
    bad_habits: {
        [key: string]: BadHabit
    }
    habits: {
        [key: string]: Habit
    }
}

export type GenericHabitAction = {
    type: string
    habit?: string
    date?: string
    habits?: { [key: string]: Habit | BadHabit }
}

export type HabitAction = GenericHabitAction & {
    habits?: { [key: string]: Habit}
}

export type BadHabitAction = GenericHabitAction & {
    habits?: { [key: string]: BadHabit}
}