import { BadHabit, GenericHabit, Habit } from "./types";

export function habitToGenericHabit(habit: Habit): GenericHabit {
    return {
        name: habit.name,
        stat: habit.xp_gain,
        coin_loss: habit.coin_loss,
        dates: habit.dates
    }
}

export function badHabitToGenericHabit(badHabit: BadHabit): GenericHabit {
    return {
        name: badHabit.name,
        stat: badHabit.hp_loss,
        dates: badHabit.dates
    }
}