import pathlib
from typing import Protocol

class ExtractionError(Exception):
    pass

class FileExtractor(Protocol):
    def extract(self, file_path: pathlib.Path) -> str:
        ...

class PlainTextExtractor:
    def extract(self, file_path: pathlib.Path) -> str:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                return f.read()
        except Exception as e:
            raise ExtractionError(f"Plain text extraction failed: {e}")

class PdfExtractor:
    def extract(self, file_path: pathlib.Path) -> str:
        try:
            from pypdf import PdfReader
            reader = PdfReader(str(file_path))
            return '\n'.join(page.extract_text() or '' for page in reader.pages)
        except Exception as e:
            raise ExtractionError(f"PDF extraction failed: {e}")

class DocxExtractor:
    def extract(self, file_path: pathlib.Path) -> str:
        try:
            import docx
            doc = docx.Document(str(file_path))
            return '\n'.join(p.text for p in doc.paragraphs)
        except Exception as e:
            raise ExtractionError(f"DOCX extraction failed: {e}")

EXTRACTORS = {
    '.txt': PlainTextExtractor(), '.md': PlainTextExtractor(), '.py': PlainTextExtractor(),
    '.pdf': PdfExtractor(), '.docx': DocxExtractor(),
}

def get_extractor(ext: str) -> FileExtractor:
    return EXTRACTORS.get(ext, PlainTextExtractor())
