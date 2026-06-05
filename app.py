from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from schema.userinput import UserInput
from model.predict import MODEL_VERSION, predict_output
import os

app = FastAPI(
    title="Gaming Addiction Level Prediction API",
    description="Predicts addiction risk using ML pipeline.",
    version=MODEL_VERSION,
    contact={
        "name": "Uday Singh Chaudhary",
        "email": "Udaysinghchaudhary2428@gmail.com"
    }
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/", tags=["General"])
def serve_home():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/predict-page", tags=["General"])
def serve_predict():
    return FileResponse(os.path.join(static_dir, "predict.html"))

@app.get("/about-page", tags=["General"])
def serve_about():
    return FileResponse(os.path.join(static_dir, "about.html"))

@app.get("/health", tags=["Monitoring"])
def health():
    return{
        "status": "ok",
        "Version": MODEL_VERSION
    }

@app.post("/predict", tags=["Prediction"])
def predict(data: UserInput):
    features = data.model_dump()

    try:
        prediction = predict_output(features)
        return {"prediction": prediction}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction Failed: {str(e)}")