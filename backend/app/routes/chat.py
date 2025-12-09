from fastapi import APIRouter, Body, HTTPException
from app.services.chat_service import ChatService

router = APIRouter()
service = ChatService()

@router.post("/chat")
async def chat(document_id: str = Body(..., embed=True), message: str = Body(..., embed=True)):
    """
    Chat endpoint. 
    document_id: Acts as the session ID for the context of this specific file.
    message: The user's query.
    """
    try:
        if not document_id or not message:
            raise HTTPException(status_code=400, detail="document_id and message are required")
            
        return await service.process_message(str(document_id), str(message))
    except Exception as e:
        print(f"Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))