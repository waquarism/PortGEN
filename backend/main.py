from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil, os, uuid, zipfile, pathlib
from app.services.parser import parse_resume
from app.services.generator import generate_portfolio_zip

app = FastAPI()

# Allow local React dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "output"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/parse")
async def parse(file: UploadFile = File(...)):
    # Save file
    file_ext = pathlib.Path(file.filename).suffix.lower()
    if file_ext not in [".pdf", ".docx", ".txt"]:
        raise HTTPException(400, "Only PDF, DOCX, TXT allowed")
    uid = str(uuid.uuid4())
    saved_path = os.path.join(UPLOAD_DIR, f"{uid}{file_ext}")
    with open(saved_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    parsed = parse_resume(saved_path)
    # Store parsed JSON for frontend preview
    parsed_id = uid
    out_json_path = os.path.join(OUTPUT_DIR, f"{parsed_id}.json")
    import json
    with open(out_json_path, "w", encoding="utf-8") as jf:
        json.dump(parsed, jf, ensure_ascii=False, indent=2)
    return JSONResponse({"id": parsed_id, "parsed": parsed})

from pydantic import BaseModel
from typing import Optional, Dict, Any

class GenerateRequest(BaseModel):
    data: Dict[str, Any]
    template: str = "react-minimal"

@app.post("/generate/{parsed_id}")
def generate(parsed_id: str, req: GenerateRequest):
    # We can ignore parsed_id for data source if data is provided in body, 
    # but we might use it for filename or logging.
    
    # If data is empty in request, try loading from file (backward compatibility)
    parsed = req.data
    if not parsed:
        json_path = os.path.join(OUTPUT_DIR, f"{parsed_id}.json")
        if not os.path.exists(json_path):
             raise HTTPException(404, "Parsed JSON not found and no data provided")
        with open(json_path, "r", encoding="utf-8") as f:
            import json
            parsed = json.load(f)
            
    zip_path = os.path.join(OUTPUT_DIR, f"{parsed_id}_portfolio.zip")
    
    try:
        generate_portfolio_zip(parsed, zip_path, req.template)
    except Exception as e:
        raise HTTPException(500, f"Generation failed: {str(e)}")
        
    return FileResponse(zip_path, media_type="application/zip", filename=f"{parsed_id}_portfolio.zip")
