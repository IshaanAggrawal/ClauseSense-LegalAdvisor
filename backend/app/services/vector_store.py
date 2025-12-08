import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
from app.core.config import settings
import ollama

class CloudOllamaEmbeddings(EmbeddingFunction):
    def __init__(self):
        self.client = ollama.Client(
            host=settings.OLLAMA_BASE_URL,
            headers={'Authorization': f"Bearer {settings.OLLAMA_API_KEY}"}
        )

    def __call__(self, input: Documents) -> Embeddings:
        response = self.client.embeddings(model='nomic-embed-text', prompt=input[0])
        return [response['embedding']]

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./data/chroma_db")
        self.ef = CloudOllamaEmbeddings()
        self.collection = self.client.get_or_create_collection("legal_docs", embedding_function=self.ef)

    def add_doc(self, doc_id: str, text: str, metadata: dict):
        self.collection.add(documents=[text], ids=[doc_id], metadatas=[metadata])

    def search(self, query: str):
        return self.collection.query(query_texts=[query], n_results=3)