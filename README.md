# InsureSight AI – Claims Anomaly Detection

InsureSight AI is an automated system that detects missing values, duplicates, inconsistencies, outliers, and ML-based anomalies in insurance claim datasets. It combines ETL processing, rule-based validation, machine learning (Isolation Forest), and an interactive dashboard.

---

## Deployments
https://insuarance-anomaly-detector-weld.vercel.app/


## Key Features

- Automated ETL pipeline for cleaning and standardizing claim data  
- Rule-based validation to detect missing fields, invalid IDs, and format issues  
- ML-based anomaly detection using Isolation Forest  
- Interactive React dashboard for visualizing anomalies and data quality  
- Real-time monitoring of processed claims and flagged anomalies  

---

## Tech Stack

### Backend
- FastAPI  
- Python  
- Pandas, NumPy  
- Scikit-learn (Isolation Forest)

### Frontend
- React (TypeScript)  
- Vite  
- Recharts  
- Axios  

---

## How to Run the Project

### Backend
- cd backend
- pip install -r requirements.txt
- uvicorn main:app --reload


Access backend at http://localhost:8000  
API documentation at http://localhost:8000/docs

---

### Frontend
- cd frontend
- npm install
- npm run dev


Access frontend at http://localhost:5173

---

## System Capabilities

- Detects duplicates, missing values, invalid formats, and outliers  
- Flags ML anomalies and assigns anomaly scores  
- Computes Data Quality Score (accuracy, completeness, uniqueness)  
- Provides claim amount analysis and anomaly distribution  
- Supports threshold-based anomaly flagging  

---

## Future Enhancements

- Cloud deployment (AWS/GCP/Azure)  
- Scalable processing with Spark or Polars  
- Additional ML models for advanced fraud detection  
- User authentication and role-based access  
- Automated report generation  

---

## Author

Om Gaikwad  



