from groq import Groq
from app.core.config import settings

class DataSanitizer:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def sanitize(self, text: str) -> str:
        # Simple heuristic to skip short/empty texts
        if len(text) < 10:
            return text

        prompt = f"""
        Task: Redact PII (Person Names, Emails, Phone Numbers) from the text below.
        Replace with [CLIENT], [EMAIL], [PHONE].
        Keep all other legal details intact.
        Output ONLY the sanitized text.
        
        Text:
        {text[:2000]} 
        """
        # Note: We truncate to 2000 chars per chunk to fit context window efficiently
        
        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.0
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Sanitization warning: {e}")
            return text # Fail open (return text) or handle error