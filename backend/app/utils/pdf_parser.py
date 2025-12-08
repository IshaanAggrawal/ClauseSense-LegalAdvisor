import io
from pypdf import PdfReader
from fastapi import UploadFile, HTTPException

class PDFParser:
    @staticmethod
    async def parse(file: UploadFile) -> str:
        filename = file.filename.lower()
        
        # 1. READ STREAM SAFELY
        # We read the content, then reset the cursor so it doesn't break other tools
        content = await file.read()
        await file.seek(0) 

        # 2. HANDLE TEXT FILES (Essential for your test script)
        if filename.endswith(".txt"):
            try:
                return content.decode("utf-8")
            except UnicodeDecodeError:
                raise HTTPException(400, "Text file must be UTF-8 encoded.")

        # 3. HANDLE PDF FILES (Your original logic, wrapped safely)
        elif filename.endswith(".pdf"):
            try:
                reader = PdfReader(io.BytesIO(content))
                # Extract text, filtering out empty pages
                return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            except Exception as e:
                raise HTTPException(400, f"Invalid PDF file: {e}")
        
        else:
            raise HTTPException(400, "Unsupported file type. Please upload .pdf or .txt")