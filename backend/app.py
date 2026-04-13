from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from fastapi.middleware.cors import CORSMiddleware
import torch.nn.functional as F



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