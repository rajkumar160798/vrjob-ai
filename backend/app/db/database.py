from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Simplified database URL with absolute path
DATABASE_URL = "sqlite:////Users/rajkumarmyakala/vrjob-ai/vrjob.db"

print(f"🔌 Connecting to database at: {DATABASE_URL}")

engine = create_engine(
    DATABASE_URL,
    echo=True,  # This will log all SQL operations
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
