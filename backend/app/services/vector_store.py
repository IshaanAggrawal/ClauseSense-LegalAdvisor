import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
from app.core.config import settings
import google.generativeai as genai

class GoogleGeminiEmbeddings(EmbeddingFunction):
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_API_KEY)

    def __call__(self, input: Documents) -> Embeddings:
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=input,
            task_type="retrieval_document"
        )
        return response['embedding']

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./data/chroma_db")
        self.ef = GoogleGeminiEmbeddings()
        # Get or create collection
        self.collection = self.client.get_or_create_collection("legal_docs", embedding_function=self.ef)

    def add_doc(self, doc_id: str, text: str, metadata: dict):
        # IMPORTANT: Ensure doc_id is in metadata for filtering
        metadata["document_id"] = doc_id
        self.collection.add(documents=[text], ids=[doc_id], metadatas=[metadata])

    def search(self, query: str, doc_id: str = None):
        """
        Search for relevant text.
        If doc_id is provided, filter results to ONLY that document.
        """
        where_filter = {"document_id": doc_id} if doc_id else None
        
        return self.collection.query(
            query_texts=[query], 
            n_results=3,
            where=where_filter
        )