import io
from pypdf import PdfReader
from fastapi import UploadFile

class PDFParser:
    @staticmethod
    async def parse(file: UploadFile) -> str:
        content = await file.read()
        reader = PdfReader(io.BytesIO(content))
        return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])