import uvicorn
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting CTECH Canteen MIS Backend on {host}:{port} (Python FastAPI + PostgreSQL)...")
    uvicorn.run("backend.app.main:app", host=host, port=port)
