from datetime import date, datetime
from fastapi import APIRouter
from .schema import BadHabitRequest, Character, HabitCompleteRequest, Skill, BadHabit, Habit, SkillRequest, HabitRequest

import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/character"
)

@router.post("/{name}")
async def create_new_character(name: str) -> Character:
    new_character = Character.new_character(name)
    await new_character.save_character()
    
    return new_character


@router.get("/{name}")
async def get_character(name: str) -> Character:
    return await Character.load_character(name)


@router.post("/{name}/skill")
async def add_skill(name: str, skill: SkillRequest) -> Character:
    current_character = await Character.load_character(name)
    skill = Skill(name=skill.name, xp=0, level=0)
    
    current_character.add_related_field("skills", skill)
    await current_character.save_related_field("skills", skill)
    
    return current_character

@router.post("/{name}/badhabit")
async def add_bad_habit(name: str, bad_habit: BadHabitRequest) -> dict[str, BadHabit]:
    current_character = await Character.load_character(name)
    bad_habit = BadHabit.from_request(bad_habit)
    current_character.add_related_field("bad_habits", bad_habit)
    await current_character.save_related_field("bad_habits", bad_habit)
    
    return current_character.bad_habits


@router.post("/{name}/habit")
async def add_habit(name: str, habit: HabitRequest) -> dict[str, Habit]:
    current_character = await Character.load_character(name)
    habit = Habit.from_request(habit)
    current_character.add_related_field("habits", habit)
    await current_character.save_related_field("habits", habit)
    
    return current_character.habits

@router.patch("/{name}/badhabit")
async def update_bad_habit(name: str, bad_habit: BadHabitRequest) -> dict[str, BadHabit]:
    current_character = await Character.load_character(name)
    bad_habit = BadHabit.from_request(bad_habit)
    current_character.add_related_field("bad_habits", bad_habit, is_update=True)
    await current_character.save_related_field("bad_habits", bad_habit)
    
    return current_character.bad_habits


@router.patch("/{name}/habit")
async def update_habit(name: str, habit: HabitRequest) -> dict[str, Habit]:
    current_character = await Character.load_character(name)
    habit = Habit.from_request(habit)
    current_character.add_related_field("habits", habit, is_update=True)
    await current_character.save_related_field("habits", habit)
    
    return current_character.habits


@router.patch("/{name}/habit/complete")
async def complete_habit(name: str, habit: HabitCompleteRequest):
    current_character = await Character.load_character(name)
    current_habit = current_character.habits[habit.name]
    has_leveled_up = current_character.increase_xp(current_habit.xp_gain)

    await current_character.save_fields(["xp", "level"])
    
    date_completed = datetime.strptime(habit.date, "%Y-%m-%d")
    current_habit.update_date(current_character, date_completed)
    await current_habit.save_date(current_character, date_completed)

    return {"level_up": has_leveled_up, "character": current_character}


@router.patch("/{name}/badhabit/complete")
async def complete_habit(name: str, habit: HabitCompleteRequest):
    current_character = await Character.load_character(name)
    current_habit = current_character.bad_habits[habit.name]
    has_died = current_character.reduce_health(current_habit.hp_loss)

    await current_character.save_fields(["health"])
    
    date_completed = datetime.strptime(habit.date, "%Y-%m-%d")
    current_habit.update_date(current_character, date_completed)
    await current_habit.save_date(current_character, date_completed)

    return {"died": has_died, "character": current_character}