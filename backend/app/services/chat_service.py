from app.services.vector_store import VectorStore
from app.services.llm_factory import LLMFactory
from app.services.session_manager import SessionManager

class ChatService:
    def __init__(self):
        self.vector_store = VectorStore()
        self.llm = LLMFactory()
        self.mgr = SessionManager()

    async def process_message(self, session_id: str, message: str):
        # 1. Check Quota (As implemented before)
        if not self.mgr.check_quota(session_id):
            return {"response": "Daily Quota Exceeded."}

        # 2. PHASE 1: ROUTING (Groq/Gemini)
        # We ask: "Is this legal or just chat?"
        router_data = self.llm.route_query(message)
        
        response_text = ""
        
        if router_data["type"] == "GENERAL":
            # CASE A: Stupid Question / Small Talk
            # We skip the Vector Search and Hugging Face entirely.
            # We just return what Groq/Gemini wrote.
            print(f"Skipping Legal Pipeline. Intent: {router_data['type']}")
            response_text = router_data["reply"]
            
        else:
            # CASE B: Legal Query
            # We proceed to the "Better Model" pipeline
            print(f"Entering Legal Pipeline. Metadata: {router_data['metadata']}")
            
            # 3. Search Vector DB (Using the keywords extracted by Groq!)
            keywords = " ".join(router_data["metadata"].get("keywords", []))
            search_query = f"{message} {keywords}"
            
            results = self.vector_store.search(search_query)
            context = " ".join(results['documents'][0]) if results['documents'] else "No relevant document text found."
            
            # 4. PHASE 2: LEGAL EXPERT (Hugging Face)
            response_text = self.llm.generate_legal_answer(
                user_query=message,
                context=context,
                metadata=router_data["metadata"]
            )

        # 5. Save & Return
        self.mgr.save_turn(session_id, message, response_text)
        
        return {
            "response": response_text,
            "router_decision": router_data["type"]
        }