import pypdf
from fastapi import UploadFile
import io

class PDFParser:
    @staticmethod
    async def parse(file: UploadFile) -> str:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        try:
            reader = pypdf.PdfReader(pdf_file)
            text = ""
            for i, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
            
            print(f"\n📄 --- PDF CONTENT PREVIEW ({file.filename}) ---")
            print(text[:500]) 
            print("-------------------------------------------\n")

            if len(text.strip()) < 50:
                raise ValueError("Parsed text is empty. This might be a scanned image PDF.")
                
            return text
        except Exception as e:
            print(f"❌ PDF Parse Error: {e}")
            raise ValueError(f"Could not read PDF: {str(e)}")