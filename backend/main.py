from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
import os
from datetime import datetime
from src.etl import load_data, normalize_df
from src.anomaly import score_rules, ml_detector

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://insuarance-anomaly-detector-weld.vercel.app/",  # Add this!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Store latest report in memory
latest_report = None

def serialize_dataframe(df):
    """Convert DataFrame to JSON-serializable format"""
    # Replace NaN/NaT with None
    df = df.replace({np.nan: None, pd.NaT: None})
    
    # Convert datetime columns to strings
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].astype(str).replace('NaT', None)
        elif pd.api.types.is_numeric_dtype(df[col]):
            # Convert numpy types to Python native types
            df[col] = df[col].apply(lambda x: None if pd.isna(x) else float(x) if isinstance(x, (np.integer, np.floating)) else x)
    
    return df.to_dict(orient="records")

@app.post("/pipeline/run")
async def run_pipeline(file: UploadFile = File(...)):
    global latest_report
    
    # Read and process CSV
    df = pd.read_csv(file.file)
    df = normalize_df(df)
    df = score_rules(df)
    df = ml_detector(df)
    
    # Save to CSV
    os.makedirs("data", exist_ok=True)
    output_path = "data/anomaly_report.csv"
    df.to_csv(output_path, index=False)
    
    # Store in memory for /pipeline/latest (serialize properly)
    latest_report = serialize_dataframe(df)
    
    return latest_report

@app.get("/pipeline/latest")
def get_latest_report():
    if latest_report is None:
        raise HTTPException(status_code=404, detail="No report available. Please run the pipeline first.")
    return latest_report

@app.get("/")
def read_root():
    return {
        "message": "InsureSight AI backend is running successfully!",
        "status": "ok",
        "endpoints": [
            "/pipeline/run",
            "/pipeline/latest",
            "/pipeline/run-sample",
            "/health"
        ]
    }


@app.post("/pipeline/run-sample")
async def run_sample_pipeline():
    """Run pipeline with sample data file"""
    global latest_report
    
    sample_path = "data/mock_claims.csv"
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample data file not found at data/mock_claims.csv")
    
    # Read and process CSV
    df = pd.read_csv(sample_path)
    df = normalize_df(df)
    df = score_rules(df)
    df = ml_detector(df)
    
    # Save to CSV
    os.makedirs("data", exist_ok=True)
    output_path = "data/anomaly_report.csv"
    df.to_csv(output_path, index=False)
    
    # Store in memory for /pipeline/latest (serialize properly)
    latest_report = serialize_dataframe(df)
    
    return latest_report

@app.get("/health")
def health_check():
    return {"status": "ok"}
