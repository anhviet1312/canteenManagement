from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables strictly from backend/.env
backend_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=backend_env_path)

# Neon PostgreSQL Connection URL
NEON_DEFAULT_URL = (
    "postgresql://neondb_owner:npg_F6RvEyg9LqSm"
    "@ep-lively-dream-bik2el6o-pooler.c-5.ap-southeast-1.aws.neon.tech"
    "/neondb?sslmode=require&channel_binding=require"
)

DATABASE_URL = os.getenv("DATABASE_URL", NEON_DEFAULT_URL)

# Configure SQLAlchemy engine with pool_pre_ping for cloud PostgreSQL (Neon)
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=300
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
