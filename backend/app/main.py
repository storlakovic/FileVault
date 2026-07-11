from fastapi import FastAPI

app = FastAPI(
    title="Server Monitor API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "status": "running",
        "service": "server-monitor-api"
    }