from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.app.db.database import get_db, engine, Base
from backend.app.users.routes import router as user_router
from backend.app.users import models

print("🚀 Starting database initialization...")
print(f"📂 Database URL: {engine.url}")

# Ensure all models are imported and registered with Base
print("📋 Registered models:")
for table in Base.metadata.tables:
    print(f"- {table}")

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
except Exception as e:
    print(f"❌ Error creating tables: {str(e)}")

app = FastAPI(title="VRJob AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "Welcome to the VRJob AI API!"}
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
@app.get("/db")
async def db_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "healthy"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
    
