import uvicorn
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    print("Starting CTECH Canteen MIS Backend (Python FastAPI + PostgreSQL 17)...")
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
