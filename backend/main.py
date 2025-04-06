from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app.users.routes import router as user_router
from app.services.job_search import JobSearchService

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="VRJob AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router, prefix="/users", tags=["users"])

# Models
class Job(BaseModel):
    id: int
    title: str
    company: str
    description: str
    status: str
    applied_date: str

class Resume(BaseModel):
    id: int
    content: str
    job_id: int

class EmailLog(BaseModel):
    id: int
    job_id: int
    status: str
    date: str

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to VRJob AI API"}

@app.get("/jobs", response_model=List[Job])
async def get_jobs():
    # TODO: Implement job fetching from database
    return []

@app.post("/apply")
async def apply_to_job(job_id: int):
    # TODO: Implement job application logic
    return {"message": f"Applied to job {job_id}"}

@app.get("/status/{job_id}")
async def get_application_status(job_id: int):
    # TODO: Implement status checking logic
    return {"status": "pending"}

@app.post("/resume")
async def customize_resume(job_id: int):
    # TODO: Implement resume customization logic
    return {"message": "Resume customized"}

@app.get("/email-scan")
async def scan_emails():
    # TODO: Implement email scanning logic
    return {"message": "Email scan completed"}

@app.post("/users/{user_id}/search-jobs")
async def search_jobs(user_id: int, db: Session = Depends(get_db)):
    job_search = JobSearchService(db)
    jobs = await job_search.process_jobs_for_user(user_id)
    return {"message": f"Processed {len(jobs)} jobs for user {user_id}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 