from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import json
import os
from ..db.database import get_db  # Fix the import path
from .models import User, BaseResume, Job, JobApplication
from ..schemas.user import UserCreate, UserResponse, UserStats
from fastapi.responses import JSONResponse
from collections import Counter

router = APIRouter()

@router.post("/intake", response_model=UserResponse)
async def create_user(
    user_data: str = Form(...),
    resume_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        parsed_data = json.loads(user_data)
        print(f"Received data: {parsed_data}")
        
        # Remove location_preference case conversion since we're not using enum anymore
        user_data_model = UserCreate(**parsed_data)
        
        # Check for existing user first
        existing_user = db.query(User).filter(User.email == user_data_model.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create user
        user = User(
            full_name=user_data_model.full_name,
            email=user_data_model.email,
            phone=user_data_model.phone,
            location_preference=user_data_model.location_preference,  # Now accepts any string
            years_experience=user_data_model.years_experience,
            skills=user_data_model.skills,
            desired_roles=user_data_model.desired_roles,
            linkedin_url=user_data_model.linkedin_url
        )
        db.add(user)
        db.flush()  # Generate user.id

        # Now create resume directory with user.id
        resume_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "resumes", str(user.id))
        os.makedirs(resume_dir, exist_ok=True)
        
        # Save resume file
        ext = os.path.splitext(resume_file.filename)[1]
        resume_path = os.path.join(resume_dir, f"base_resume{ext}")
        
        content = await resume_file.read()
        with open(resume_path, "wb") as f:
            f.write(content)

        base_resume = BaseResume(
            user_id=user.id,
            file_path=resume_path,
            content=content.decode(errors="ignore")
        )
        db.add(base_resume)
        db.commit()
        db.refresh(user)

        return user
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug print
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}/stats", response_model=UserStats)
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    applications = user.job_applications
    total_applications = len(applications)

    stats = {
        "total_applications": total_applications,
        "seen": len([a for a in applications if a.status == "seen"]),
        "rejected": len([a for a in applications if a.status == "rejected"]),
        "ghosted": len([a for a in applications if a.status == "ghosted"]),  # Added ghosted count
        "interview": len([a for a in applications if a.status == "interview"]),
        "resume_versions": len(user.base_resume.resume_versions) if user.base_resume else 0  # Modified this line
    }

    response_times = [
        (a.last_status_update - a.applied_at).total_seconds() / 3600
        for a in applications if a.last_status_update and a.status != "applied"
    ]
    if response_times:
        stats["average_response_time"] = sum(response_times) / len(response_times)

    if stats["interview"] and total_applications:
        stats["success_rate"] = (stats["interview"] / total_applications) * 100

    rejection_reasons = [a.rejection_reason for a in applications if a.rejection_reason]
    if rejection_reasons:
        stats["most_common_rejection"] = max(set(rejection_reasons), key=rejection_reasons.count)

    all_jobs = db.query(Job).join(JobApplication).filter(JobApplication.user_id == user_id).all()
    job_skills = []
    for job in all_jobs:
        job_skills.extend(job.description.lower().split())

    user_skills = [skill.lower() for skill in user.skills]
    matched_skills = [skill for skill in user_skills if skill in job_skills]
    stats["top_skills_matched"] = list(dict(Counter(matched_skills).most_common(5)).keys())

    matched_roles = [
        role for role in user.desired_roles
        if any(role.lower() in job.title.lower() for job in all_jobs)
    ]
    stats["preferred_roles_matched"] = matched_roles

    return UserStats(**stats)

@router.post("/{user_id}/search-jobs")
async def search_and_apply_jobs(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    from ..services.job_search import JobSearchService

    job_search_service = JobSearchService(db)
    applications = job_search_service.process_jobs_for_user(user)

    return {
        "message": f"Processed {len(applications)} jobs for user {user_id}",
        "applied_jobs": [a.job.title for a in applications]
    }
