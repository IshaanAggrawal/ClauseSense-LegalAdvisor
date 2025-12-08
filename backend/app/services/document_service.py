import uuid
from fastapi import UploadFile
from app.services.vector_store import VectorStore
from app.services.sanitizer import DataSanitizer
from app.utils.pdf_parser import PDFParser

class DocumentService:
    def __init__(self):
        self.vector_store = VectorStore()
        self.sanitizer = DataSanitizer()

    async def process_upload(self, file: UploadFile):
        # 1. Parse & Sanitize
        raw_text = await PDFParser.parse(file)
        clean_text = self.sanitizer.sanitize(raw_text)
        
        # 2. Chunking with 10% Overlap
        chunk_size = 2000
        overlap = 200
        chunks = []
        start = 0
        while start < len(clean_text):
            end = start + chunk_size
            chunks.append(clean_text[start:end])
            start += (chunk_size - overlap)
        
        # 3. Store
        doc_id = str(uuid.uuid4())
        for idx, chunk in enumerate(chunks):
            self.vector_store.add_doc(f"{doc_id}_{idx}", chunk, {"doc_id": doc_id, "filename": file.filename})
            
        return {"status": "success", "doc_id": doc_id, "chunks": len(chunks)}