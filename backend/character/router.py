from fastapi import APIRouter, HTTPException
from fastapi.exceptions import ResponseValidationError
from database import character
from .schema import Character

router = APIRouter(
    prefix="/character"
)

@router.post("/")
async def create_character(character_data: Character):
    await character.update_one(
        {"name": character_data.name}, 
        {"$set": character_data.model_dump()}, 
        upsert=True
    )
    return {"message": "success"}
    
@router.get("/{name}")
async def get_character(name: str) -> Character:
    found_character = await character.find_one({"name": name})
    if found_character is None:
        raise HTTPException(
            status_code=404,
            detail="Character not found"
        )
        
    return found_character
