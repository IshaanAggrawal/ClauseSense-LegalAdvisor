from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.chat_service import ChatService

router = APIRouter()
service = ChatService()

class ChatRequest(BaseModel):
    session_id: str
    document_id: str  # <--- MUST MATCH FRONTEND JSON KEY
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        return await service.process_message(
            session_id=request.session_id,
            doc_id=request.document_id, # Mapping document_id -> doc_id
            message=request.message
        )
    except Exception as e:
        raise HTTPException(500, str(e))