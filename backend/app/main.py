from fastapi import FastAPI
from app.core.config import settings
from app.routes import upload, chat

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["Documents"])
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["Chat"])

@app.get("/")
def root():
    return {"message": "Legal Advisor AI is Running"}