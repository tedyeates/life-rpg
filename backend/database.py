import motor.motor_asyncio
from config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongo_url)
db = client.get_database("liferpg")
character = db.get_collection("character")