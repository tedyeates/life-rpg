from fastapi import FastAPI
from character import router as character_router

app = FastAPI(
    root_path='/api'
)
app.include_router(character_router.router)

@app.get("/version")
def version():
    return {"version": "0.1"}

