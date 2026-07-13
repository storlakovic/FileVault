from fastapi import FastAPI
from app.api import auth


app = FastAPI(
    title="FileVault API",
    version="1.0.0"
)

app.include_router(auth.router)
