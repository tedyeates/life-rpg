from pydantic import BaseModel, constr

class Character(BaseModel):
    name: str