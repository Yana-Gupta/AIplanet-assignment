from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from tempfile import NamedTemporaryFile
from app.database import SessionLocal, engine
import boto3
from sqlalchemy.orm import Session
from botocore.exceptions import ClientError
import os
from datetime import datetime 
import uuid
from app import model
from app import helper




model.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
bucket_name = os.getenv("AWS_S3_BUCKET_NAME")


s3_client = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)


@app.get("/")
def read_root():
    return "welcome to the home route"


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)): 
    try:
        with NamedTemporaryFile(delete=False) as tmp_file:
            tmp_file.write(await file.read())
            tmp_file.flush()

            unique_id = uuid.uuid4()

            s3_key = f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}_{unique_id}"
            s3_client.upload_file(tmp_file.name, bucket_name, s3_key)

            s3_client.head_object(Bucket=bucket_name, Key=s3_key)
            
            text = helper.extract_text_from_pdf(tmp_file.name)
            
            new_file_info =  model.UploadedPDF(pdfkey=s3_key, name=file.filename, text=text)
            
            db.add(new_file_info)
            db.commit()
            db.refresh(new_file_info)
            
        return {
            "message": f"File '{file.filename}' uploaded successfully to server",
            "new_file_info": new_file_info
        }
    except ClientError as e:
        return JSONResponse(status_code=500, content={"detail": f"Failed to upload file to S3: {e}"})


@app.post("/qn")
async def ask_question(questiondata: model.QuestionRequest, db: Session = Depends(get_db)):
    try:
        question = questiondata.question
        key = questiondata.key
        
        get_pdf = db.query(model.UploadedPDF).filter(model.UploadedPDF.pdfkey == key).first()
        
        if get_pdf is None:
            raise HTTPException(status_code=400, detail=f"PDF with key {key} not found")
        
        
        result = helper.get_ans(get_pdf.text, question)
        
        return {
            "result": result
        }
        
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")
