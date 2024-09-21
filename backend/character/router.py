from datetime import date
from fastapi import APIRouter
from .schema import BadHabitRequest, Character, Skill, BadHabit, Habit, SkillRequest, HabitRequest


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
async def add_bad_habit(name: str, bad_habit: BadHabitRequest) -> Character:
    current_character = await Character.load_character(name)
    bad_habit = BadHabit(name=bad_habit.name, dates=[], hp_loss=bad_habit.hp_loss)
    current_character.add_related_field("bad_habits", bad_habit)
    await current_character.save_related_field("bad_habits", bad_habit)
    
    return current_character


@router.post("/{name}/habit")
async def add_habit(name: str, habit: HabitRequest) -> Character:
    current_character = await Character.load_character(name)
    habit = Habit(name=habit.name, dates=[], xp_gain=habit.xp_gain)
    current_character.add_related_field("habits", habit)
    await current_character.save_related_field("habits", habit)
    
    return current_character

@router.put("/{name}/badhabit")
async def add_bad_habit(name: str, bad_habit: BadHabitRequest) -> Character:
    current_character = await Character.load_character(name)
    bad_habit = BadHabit(name=bad_habit.name, dates=[], hp_loss=bad_habit.hp_loss)
    current_character.add_related_field("bad_habits", bad_habit, is_update=True)
    await current_character.save_related_field("bad_habits", bad_habit)
    
    return current_character


@router.put("/{name}/habit")
async def add_habit(name: str, habit: HabitRequest) -> Character:
    current_character = await Character.load_character(name)
    habit = Habit(name=habit.name, dates=[], xp_gain=habit.xp_gain)
    current_character.add_related_field("habits", habit, is_update=True)
    await current_character.save_related_field("habits", habit)
    
    return current_character
