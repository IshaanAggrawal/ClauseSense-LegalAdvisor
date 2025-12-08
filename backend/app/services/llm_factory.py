import google.generativeai as genai
from groq import Groq
from huggingface_hub import InferenceClient
from app.core.config import settings
from app.services.sanitizer import DataSanitizer
import json

class LLMFactory:
    def __init__(self):
        self.sanitizer = DataSanitizer()
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.gemini = genai.GenerativeModel('gemini-2.0-flash')
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        self.hf_client = InferenceClient(token=settings.HF_API_KEY)
        self.hf_model_id = settings.HF_INFERENCE_URL 

    def _call_groq_router(self, prompt: str):
        """Backup call if Google fails"""
        completion = self.groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile", 
            response_format={"type": "json_object"}
        )
        return completion.choices[0].message.content

    def route_query(self, user_query: str):
        """
        Decides if the query is GENERAL (Chat) or LEGAL (RAG Search).
        """
        safe_query = self.sanitizer.sanitize(user_query)
        
        router_prompt = f"""
        Analyze this query: "{safe_query}"
        Return ONLY a JSON object.
        
        1. If it's small talk ("Hi", "Thanks"), a joke, code, or math:
           Output: {{ "type": "GENERAL", "reply": "Your friendly reply here." }}
           
        2. If it is about Law, Contracts, Crime, Courts, or the uploaded document:
           Output: {{ 
             "type": "LEGAL", 
             "metadata": {{ "jurisdiction": "India", "keywords": ["keyword1", "keyword2"] }} 
           }}
        """
        
        # Attempt 1: Gemini 2.0 Flash
        try:
            response = self.gemini.generate_content(
                router_prompt, 
                generation_config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            data["_debug_router"] = "Gemini 2.0 Flash"
            return data
            
        except Exception as e:
            print(f"⚠️ Gemini Router Failed: {e}. Switching to Groq...")
            
            # Attempt 2: Groq Fallback
            try:
                data = json.loads(self._call_groq_router(router_prompt))
                data["_debug_router"] = "Groq Llama 3.3"
                return data
            except Exception as e2:
                print(f"❌ Groq Router Failed: {e2}")
                return {"type": "GENERAL", "reply": "I'm having trouble connecting right now.", "_debug_router": "None"}

    def generate_legal_answer(self, user_query: str, context: str, metadata: dict):
        """
        Uses Hugging Face to draft the final legal advice.
        """
        safe_query = self.sanitizer.sanitize(user_query)
        state = metadata.get("jurisdiction", "India")
        
        # 1. OPTIMIZED PROMPT: Short & Direct (Saves Input Tokens)
        system_msg = (
            f"You are a Senior Legal Advisor for {state}. "
            f"Answer the user's question in 2 concise sentences based strictly on the Context."
        )

        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": f"Context: {context}\n\nQuestion: {safe_query}"}
        ]

        try:
            response = self.hf_client.chat_completion(
                messages=messages,
                model=self.hf_model_id, 
                max_tokens=150,        # REDUCED: extremely cheap
                temperature=0.1,       # PRECISE
                stop=["Question:"]     # FIX: Removed "\n\n" so it doesn't cut itself off
            )
            answer = response.choices[0].message.content.strip()
            if not answer.endswith('.'):
                answer += "."
                
            final_output = f"{answer} \n\n(Disclaimer: I am an AI, not a lawyer. Consult a professional.)"
            return final_output
            
        except Exception as e:
            return f"Legal Model Error: {str(e)}"