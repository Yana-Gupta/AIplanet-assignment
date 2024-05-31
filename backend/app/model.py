from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from app.database import Base
from pydantic import BaseModel


class UploadedPDF(Base):
    __tablename__ = 'uploaded_pdfs'
    pdfkey = Column(String, primary_key=True)
    name = Column(String)
    text = Column(Text)
    time = Column(DateTime, default=datetime.now())
    
    
class QuestionRequest(BaseModel):
    key: str
    question: str
