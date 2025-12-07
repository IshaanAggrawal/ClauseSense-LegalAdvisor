from fastapi import FastAPI
from app.routes import upload

app = FastAPI(title="Legal Advisor PDF Uploader")

# Include the upload router
app.include_router(upload.router, prefix="/api")