from app.services.vector_store import VectorStore
from app.services.llm_factory import LLMFactory
from app.services.session_manager import SessionManager

class ChatService:
    def __init__(self):
        self.vector_store = VectorStore()
        self.llm = LLMFactory()
        self.mgr = SessionManager()

    async def process_message(self, session_id: str, message: str):
        # 1. RAG Search
        results = self.vector_store.search(message)
        context = " ".join(results['documents'][0]) if results['documents'] else "No context found."
        
        # 2. Generate Answer
        response = self.llm.generate_response(message, context)
        
        # 3. Save History
        self.mgr.save_turn(session_id, message, response)
        
        return {"response": response}