from huggingface_hub import InferenceClient
from app.core.config import settings
from app.services.sanitizer import DataSanitizer

class LLMFactory:
    def __init__(self):
        self.sanitizer = DataSanitizer()
        self.client = InferenceClient(model=settings.HF_INFERENCE_URL, token=settings.HF_API_KEY)

    def generate_response(self, user_query: str, context: str):
        safe_query = self.sanitizer.sanitize(user_query)
        
        system_prompt = """You are an expert Indian Legal Advisor. 
        Answer based STRICTLY on the Context provided.
        - Cite specific sections if available.
        - If the answer is missing, state 'I cannot find this in the document.'
        - Do not hallucinate."""
        
        formatted_prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
        {system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>
        Context: {context}
        Question: {safe_query}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

        try:
            return self.client.text_generation(formatted_prompt, max_new_tokens=1024, temperature=0.2)
        except Exception as e:
            return f"AI Error: {str(e)}"