from fastapi import HTTPException
from pydantic import BaseModel
from datetime import date
from database import character

MAX_HEALTH = 100
MAX_XP = 1000

class SkillRequest(BaseModel):
    name: str
    
    
class Skill(SkillRequest):
    xp: int
    level: int
    
    def reset(self) -> None:
        """Reset a skill's progress to the starting point."""
        self.xp = 0
        self.level = 0
    

class HabitRequest(BaseModel):
    name: str
    xp_gain: int

class Habit(HabitRequest):
    dates: list[date]
    
    
class BadHabitRequest(BaseModel):
    name: str
    hp_loss: int
    
class BadHabit(BadHabitRequest):
    dates: list[date]
    
    
class Character(BaseModel):
    name: str
    health: int
    coins: int
    xp: int
    level: int
    skills: dict[str, Skill]
    bad_habits: dict[str, BadHabit]
    habits: dict[str, Habit]
    
    @classmethod
    def new_character(cls, name: str) -> "Character":
        return cls(
            name=name, 
            health=MAX_HEALTH, 
            coins=0, 
            xp=0, 
            level=0, 
            skills={},
            habits={},
            bad_habits={}
        )
    
    @classmethod
    async def load_character(cls, name: str) -> "Character":
        found_character = await character.find_one({"name": name})
        if found_character is None:
            raise HTTPException(status_code=404, detail="Character not found")
        
        return cls(**found_character)
    
    async def save_character(self):
        await character.update_one(
            {"name": self.name},
            {"$setOnInsert": self.model_dump()},
            upsert=True
        )
        
    async def save_field(self, field_name: str):
        await character.update_one(
            {"name": self.name}, 
            {"$set": {field_name: getattr(self, field_name)}},
            upsert=True
        )
    
    
    async def save_related_field(self, field: str, related_field: Habit | Skill | BadHabit):
        await character.update_one(
            {"name": self.name}, 
            {"$set": {
                f"{field}.{related_field.name}": related_field.model_dump()
            }}
        )
        
        
    def add_related_field(
        self, 
        field: str, 
        related_field: Habit | Skill | BadHabit, 
        is_update: bool = False
    ):
        field_value = getattr(self, field)
        if related_field.name in field_value and not is_update:
            raise HTTPException(
                status_code=400, 
                detail=f"{field.replace("_", " ").capitalize()} already exists"
            )
            
        if related_field.name not in field_value and is_update:
            raise HTTPException(
                status_code=400, 
                detail=f"{related_field.name.replace("_", " ").capitalize()} doesn't exists"
            )
        
        setattr(self, field, {**field_value, related_field.name: related_field})
        
    def reduce_health(self, damage: int):
        self.health -= damage
        if self.health <= 0:
            self.reset()
            
            return False
        
        return True
    
        
    def increase_health(self, health_increase: int):
        self.health += health_increase
        if self.health > self.MAX_HEALTH:
            self.health = self.MAX_HEALTH
            
    def reset(self):
        self.health = self.MAX_HEALTH
        self.coins = 0
        self.xp = 0
        self.level = 0
        for skill in self.skills:
            skill.reset()
        
        
    def increase_coins(self, coin_increase):
        self.coins += coin_increase
        
    def decrease_coins(self, coin_decrease):
        self.coins -= coin_decrease
        
    
    def increase_xp(self, xp_increase):
        self.xp += xp_increase
        if self.xp >= self.MAX_XP:
            self.xp -= self.MAX_XP
            self.level += 1
            
            return True
        
        return False
            
