import uuid
from fastapi import UploadFile
from app.services.session_manager import SessionManager
from app.utils.pdf_parser import PDFParser

class DocumentService:
    # --- SECURITY CONSTANTS ---
    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB Limit (Standard for Text-based RAG)
    MAX_TEXT_CHARS = 50000           # ~15-20 pages of dense text (Prevents DB bloat)
    ALLOWED_TYPES = ('.pdf', '.docx', '.txt')

    def __init__(self):
        # No Pinecone, Direct Database Storage
        self.db_manager = SessionManager()

    async def process_upload(self, file: UploadFile):
        # 1. SECURITY: Check File Extension
        if not file.filename.lower().endswith(self.ALLOWED_TYPES):
            raise ValueError(f"Invalid file type. Allowed: {', '.join(self.ALLOWED_TYPES)}")
            
        # 2. SECURITY: Check Binary Size (Fastest Check)
        file.file.seek(0, 2) # Move cursor to end
        file_size = file.file.tell() # Get position (size in bytes)
        file.file.seek(0) # Reset cursor to start
        
        if file_size > self.MAX_FILE_SIZE:
            mb_size = file_size / (1024 * 1024)
            raise ValueError(f"File too large ({mb_size:.2f}MB). Limit is 2MB.")

        # 3. Parse Document
        try:
            raw_text = await PDFParser.parse(file)
            
            # 4. SECURITY: Check Text Content Length
            text_len = len(raw_text)
            print(f"📄 Extracted {text_len} characters.")
            
            if text_len < 50: 
                raise ValueError("File appears empty or is an image-based PDF.")
            
            if text_len > self.MAX_TEXT_CHARS:
                raise ValueError(f"Document text too long ({text_len} chars). Limit is {self.MAX_TEXT_CHARS}.")
                
        except Exception as e:
            return {"status": "error", "message": str(e)}
        
        # 5. Save Safe Content to Database
        doc_id = str(uuid.uuid4())
        print(f"💾 Saving clean text to Database (ID: {doc_id})...")
        
        self.db_manager.register_document(doc_id, file.filename, file_size, raw_text)
            
        return {"status": "success", "doc_id": doc_id}