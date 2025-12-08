from fastapi import APIRouter, Body, HTTPException
from app.services.chat_service import ChatService

router = APIRouter()
service = ChatService()

@router.post("/chat")
async def chat(session_id: str = Body(..., embed=True), message: str = Body(..., embed=True)):
    try:
        return await service.process_message(session_id, message)
    except Exception as e:
        raise HTTPException(500, str(e))