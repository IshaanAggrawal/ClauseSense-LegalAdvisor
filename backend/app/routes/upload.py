from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.document_service import DocumentService

router = APIRouter()
service = DocumentService()

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    try:
        return await service.process_upload(file)
    except Exception as e:
        raise HTTPException(500, str(e))