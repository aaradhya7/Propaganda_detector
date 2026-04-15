from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from fastapi.middleware.cors import CORSMiddleware
import torch.nn.functional as F
import os
from pathlib import Path



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# load model
model_path = "propaganda_deberta_7class"

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

class TextInput(BaseModel):
    text: str

@app.post("/detect")
def detect(data: TextInput):

    inputs = tokenizer(data.text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits

    probs = F.softmax(logits, dim=1)

    prediction = torch.argmax(probs).item()
    confidence = torch.max(probs).item()

    # 👉 map class index to technique name
    labels = [
        "Loaded Language",
        "Name Calling",
        "Fear Mongering",
        "Appeal to Authority",
        "Glittering Generalities",
        "Bandwagon",
        "Card Stacking"
    ]

    return {
        "prediction": labels[prediction],
        "confidence": confidence,
        "all_scores": probs.tolist()[0]
    }


# 📌 Serve frontend from dist folder
DIST_DIR = Path(__file__).parent.parent / "dist"

# Mount static files
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve React SPA - return index.html for all non-API routes"""
        file_path = DIST_DIR / full_path
        
        # If it's a file that exists, serve it
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        
        # Otherwise serve index.html for client-side routing
        index_html = DIST_DIR / "index.html"
        if index_html.exists():
            return FileResponse(index_html)
        
        return {"error": "Frontend not built. Run 'npm run build' in project root"}
else:
    @app.get("/")
    async def root():
        return {"message": "Frontend dist folder not found. Build the frontend first with 'npm run build'"}