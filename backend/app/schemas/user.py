from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional
from datetime import datetime
from ..users.models import WorkArrangement

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location_preference: str
    years_experience: int
    skills: List[str]
    desired_roles: List[str]
    linkedin_url: Optional[str] = None
    salary_expectation: Optional[int] = None
    preferred_industries: Optional[List[str]] = None
    work_arrangements: Optional[List[WorkArrangement]] = None
    visa_sponsorship: bool = False
    relocation_willingness: bool = False

    class Config:
        from_attributes = True
        use_enum_values = True

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None  # Make updated_at optional

    class Config:
        from_attributes = True  # ✅ Pydantic v2

class UserStats(BaseModel):
    total_applications: int
    seen: int
    rejected: int
    ghosted: int
    interview: int
    resume_versions: int
    most_common_rejection: Optional[str] = None
    average_response_time: Optional[float] = None
    success_rate: Optional[float] = None
    top_skills_matched: Optional[List[str]] = None
    preferred_roles_matched: Optional[List[str]] = None