from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import json
from ..database import get_db
from ..models import User, BaseResume, LocationPreference
from ..schemas.user import UserCreate, UserResponse
import os
from datetime import datetime

router = APIRouter()

@router.post("/intake", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    resume_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        location_preference=user_data.location_preference,
        years_experience=user_data.years_experience,
        skills=user_data.skills,
        desired_roles=user_data.desired_roles,
        linkedin_url=user_data.linkedin_url
    )
    db.add(user)
    db.flush()  # Get the user ID
    
    # Save resume file
    resume_dir = f"data/resumes/{user.id}"
    os.makedirs(resume_dir, exist_ok=True)
    resume_path = f"{resume_dir}/base_resume{os.path.splitext(resume_file.filename)[1]}"
    
    with open(resume_path, "wb") as f:
        content = await resume_file.read()
        f.write(content)
    
    # Create base resume record
    base_resume = BaseResume(
        user_id=user.id,
        file_path=resume_path,
        content=content.decode()  # Assuming text content for now
    )
    db.add(base_resume)
    
    db.commit()
    db.refresh(user)
    
    return user

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get application statistics
    applications = user.job_applications
    stats = {
        "total_applications": len(applications),
        "seen": len([a for a in applications if a.status == "seen"]),
        "rejected": len([a for a in applications if a.status == "rejected"]),
        "ghosted": len([a for a in applications if a.status == "ghosted"]),
        "interview": len([a for a in applications if a.status == "interview"]),
        "resume_versions": len(user.resume_versions)
    }
    
    # Get most common rejection reason
    rejection_reasons = [a.rejection_reason for a in applications if a.rejection_reason]
    if rejection_reasons:
        stats["most_common_rejection"] = max(set(rejection_reasons), key=rejection_reasons.count)
    
    return stats 