import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
from app.core.config import settings
import google.generativeai as genai

class GoogleGeminiEmbeddings(EmbeddingFunction):
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_API_KEY)

    def __call__(self, input: Documents) -> Embeddings:
        # Use the latest text embedding model
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
        self.collection = self.client.get_or_create_collection("legal_docs", embedding_function=self.ef)

    def add_doc(self, doc_id: str, text: str, metadata: dict):
        self.collection.add(documents=[text], ids=[doc_id], metadatas=[metadata])

    def search(self, query: str):
        return self.collection.query(query_texts=[query], n_results=3)