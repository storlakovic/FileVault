from fastapi import FastAPI
from starlette import endpoints

from api.endpoints import auth
from api.endpoints import user_endpoint
import uvicorn

app = FastAPI(
    title="FileVault API",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(user_endpoint.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
