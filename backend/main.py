from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from character import router as character_router

app = FastAPI(
    root_path='/api'
)
app.include_router(character_router.router)

@app.exception_handler(ValidationError)
async def validation_exception_handler(response: Response, exception: ValidationError):
    return JSONResponse(
        status_code=400,
        content={
            "message": "Missing values or incorrect format", 
            "detail": exception.json()
        }
    )

@app.get("/version")
def version():
    return {"version": "0.1"}

