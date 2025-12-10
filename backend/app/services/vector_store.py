from pinecone import Pinecone, ServerlessSpec
from app.core.config import settings
import google.generativeai as genai
import time
#removed pine cone for now as i am focusing <50 page contract .
class VectorStore:
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = "legal-advisor-index"
        self.index = None 

    def _ensure_index_ready(self):
        if self.index: return self.index
        try:
            existing = [i.name for i in self.pc.list_indexes()]
            if self.index_name not in existing:
                self.pc.create_index(
                    name=self.index_name,
                    dimension=768, 
                    metric="cosine", 
                    spec=ServerlessSpec(cloud="aws", region="us-east-1")
                )
                time.sleep(5) 
            self.index = self.pc.Index(self.index_name)
            return self.index
        except Exception as e:
            print(f"⚠️ Pinecone Connect Error: {e}")
            raise e

    def get_embedding(self, text: str):
        try:
            return genai.embed_content(
                model="models/text-embedding-004",
                content=text.replace("\n", " "),
                task_type="retrieval_document"
            )['embedding']
        except: return []

    def add_doc(self, doc_id: str, text: str, metadata: dict):
        index = self._ensure_index_ready()
        vector = self.get_embedding(text)
        if vector:
            # Use millisecond timestamp to ensure unique ID for every chunk
            index.upsert(vectors=[{
                "id": f"{doc_id}_{int(time.time()*1000)}", 
                "values": vector, 
                "metadata": {**metadata, "text": text[:2000], "doc_id": doc_id} 
            }])

    def search(self, query: str, doc_id: str = None, top_k: int = 5):
        """Robust Search with Retry Loop to handle Index Lag"""
        index = self._ensure_index_ready()
        query_vector = genai.embed_content(
            model="models/text-embedding-004",
            content=query,
            task_type="retrieval_query"
        )['embedding']
        
        filter_dict = {"doc_id": {"$eq": doc_id}} if doc_id and doc_id not in ["general", "general_chat"] else None
        
        # RETRY LOOP: Wait up to 10 seconds for data to appear
        max_retries = 5
        for attempt in range(max_retries):
            results = index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict 
            )
            
            # Handle response safely (Pinecone returns Objects, not just Dicts)
            matches = getattr(results, 'matches', []) or results.get('matches', [])
            
            # If we found data OR we aren't filtering for a specific file, return immediately
            if matches or not filter_dict:
                return results
            
            # If we are looking for a specific file but found nothing, wait and try again
            print(f"⏳ Indexing lag... Retry {attempt+1}/{max_retries} for doc_id: {doc_id}")
            time.sleep(2) 
            
        return results