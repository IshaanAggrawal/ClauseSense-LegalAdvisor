from app.services.session_manager import SessionManager
from groq import Groq
from app.core.config import settings

class ChatService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.mgr = SessionManager()

    async def process_message(self, session_id: str, doc_id: str, message: str):
        # 1. Get Chat History
        history = self.mgr.get_history(session_id)
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])

        # 2. MULTI-DOCUMENT FETCHING LOGIC
        context_parts = []
        
        # Split the comma-separated string into a list of IDs
        if doc_id and doc_id not in ["general", "general_chat", ""]:
            doc_ids_list = [d.strip() for d in doc_id.split(',')]
            print(f"📖 Processing {len(doc_ids_list)} documents: {doc_ids_list}")

            for d_id in doc_ids_list:
                if not d_id: continue
                
                # Fetch individual document content
                doc_data = self.mgr.get_document_data(d_id)
                
                if doc_data:
                    text = doc_data.get('content', '')
                    filename = doc_data.get('filename', 'Unknown File')
                    
                    # Truncate text to fit context window (approx 15k chars per doc if comparing 2)
                    limit = 30000 // max(1, len(doc_ids_list))
                    if len(text) > limit:
                        text = text[:limit] + "...[truncated]"
                        
                    context_parts.append(f"\n--- START DOCUMENT: {filename} ---\n{text}\n--- END DOCUMENT ---\n")
                else:
                    print(f"⚠️ Warning: Could not find doc {d_id} in DB")

        full_context = "\n".join(context_parts)
        
        if not full_context:
            full_context = "No documents found in context. Answer based on general legal knowledge."

        # 3. Build System Prompt
        system_prompt = (
            "You are an expert Legal Advisor AI. "
            "I have provided one or more documents below. "
            "Answer the user's question based strictly on these documents. "
            "If comparing documents, explicitly cite differences in clauses or terms between them."
            "\n\nDISCLAIMER: I am an AI, not a lawyer."
        )
        
        user_prompt = f"""
        CHAT HISTORY:
        {history_text}

        ACTIVE DOCUMENTS:
        {full_context}
        
        QUESTION: 
        {message}
        """

        try:
            # 4. Generate Answer
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.1
            )
            
            response_text = completion.choices[0].message.content
            
            # Save the turn (Link to the first document for simplicity)
            primary_doc = doc_id.split(',')[0].strip() if doc_id else "general"
            self.mgr.save_turn(session_id, primary_doc, message, response_text)

            return {
                "response": response_text,
                "router_decision": "Multi-Doc Analysis",
                "sources": [f"{len(context_parts)} Documents"]
            }
        except Exception as e:
            print(f"Chat Error: {e}")
            return {"response": f"System Error: {str(e)}", "sources": []}