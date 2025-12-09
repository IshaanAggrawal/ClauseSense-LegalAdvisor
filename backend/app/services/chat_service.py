from app.services.vector_store import VectorStore
from app.services.llm_factory import LLMFactory
from app.services.session_manager import SessionManager

class ChatService:
    def __init__(self):
        self.vector_store = VectorStore()
        self.llm = LLMFactory()
        self.mgr = SessionManager()

    async def process_message(self, session_id: str, message: str):
        # 1. Check Quota
        if not self.mgr.check_quota(session_id):
            return {"response": "Daily Quota Exceeded."}

        # 2. Get Chat History (Context)
        history_records = self.mgr.get_history(session_id)
        
        # Format history into a string for the LLM
        history_context = ""
        if history_records:
            history_context = "Previous Conversation:\n" + "\n".join(
                [f"User: {h['user_message']}\nAI: {h['ai_response']}" for h in history_records]
            ) + "\n\n"

        # Combine history with current message for routing/understanding
        full_context_message = f"{history_context}Current User Question: {message}"

        # 3. ROUTING
        # We pass the message + context so the router understands references like "it" or "that"
        router_data = self.llm.route_query(full_context_message)
        
        response_text = ""
        
        if router_data["type"] == "GENERAL":
            # Just chat using the history context
            response_text = router_data["reply"]
            
        else:
            print(f"Entering Legal Pipeline. Metadata: {router_data['metadata']}")
            keywords = " ".join(router_data["metadata"].get("keywords", []))
            
            # Search query emphasizes the new question but uses keywords
            search_query = f"{message} {keywords}"
            
            # 4. SEARCH (Filtered by session_id/document_id)
            results = self.vector_store.search(search_query, doc_id=session_id)
            
            if not results or 'documents' not in results or not results['documents']:
                # Fallback: If vector search fails, try to answer with just general knowledge 
                # instead of crashing or saying "Nothing found" immediately if it's a simple follow-up.
                if history_records:
                     response_text = self.llm.generate_legal_answer(
                        user_query=full_context_message,
                        context="No specific document text found for this query, refer to previous context.",
                        metadata=router_data["metadata"]
                    )
                else:
                    return {
                        "response": "I couldn't find any relevant information in the document to answer your question.",
                        "router_decision": "NO_RESULTS"
                    }
            else:
                context_doc = " ".join(results['documents'][0])
                
                # 5. GENERATE ANSWER
                response_text = self.llm.generate_legal_answer(
                    user_query=full_context_message, # Pass history + question
                    context=context_doc,
                    metadata=router_data["metadata"]
                )

        # 6. Save this turn
        self.mgr.save_turn(session_id, message, response_text)
        
        return {
            "response": response_text,
            "router_decision": router_data["type"]
        }