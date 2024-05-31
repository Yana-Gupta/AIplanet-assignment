import fitz
from dotenv import load_dotenv
from fastapi import HTTPException
import boto3
import os 

from langchain_community.llms import Ollama

load_dotenv()

aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
bucket_name = os.getenv("AWS_S3_BUCKET_NAME")

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with fitz.open(pdf_path) as pdf_document:
            for page in pdf_document:
                text += page.get_text()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")

    return text


def get_pdf_from_s3(key: str):
    s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
    try:
        obj = s3.get_object(Bucket=bucket_name, Key=key)
        return obj['Body']
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")


def get_ans(text, question):
    llm = Ollama(model="llama3")

    result = llm.invoke('Text: '+ text +  '\n' +  'Question: ' + question +  'Answer the question from text.')
    return result
