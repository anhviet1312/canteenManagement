from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed import seed_database
from .routers import auth, menu, pos, approval, inventory, dss, ctool, reports, audit

# Ensure tables exist and initial data is seeded
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="CTECH Canteen MIS Backend API",
    description="Hệ thống Thông tin Quản lý Căng tin Trường Cao đẳng CTECH (Python FastAPI + PostgreSQL 17)",
    version="1.0.0"
)

# Enable CORS for Frontend (React Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(pos.router)
app.include_router(approval.router)
app.include_router(inventory.router)
app.include_router(dss.router)
app.include_router(ctool.router)
app.include_router(reports.router)
app.include_router(audit.router)

@app.get("/")
def root():
    return {
        "system": "Hệ Thống Thông Tin Quản Lý Căng Tin CTECH",
        "backend": "Python FastAPI",
        "database": "PostgreSQL 17 (canteen_ctech)",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
