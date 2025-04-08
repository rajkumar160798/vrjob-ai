from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..db.database import Base

class WorkArrangement(enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    FREELANCE = "freelance"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    location_preference = Column(String, nullable=False)  # Changed from Enum to String
    years_experience = Column(Integer, nullable=False)
    skills = Column(JSON, nullable=False)  # List of skills
    desired_roles = Column(JSON, nullable=False)  # List of desired roles
    linkedin_url = Column(String)
    salary_expectation = Column(Integer, nullable=True)
    preferred_industries = Column(JSON, nullable=True)  # List of preferred industries
    work_arrangements = Column(JSON, nullable=True)  # List of work arrangements
    visa_sponsorship = Column(Boolean, default=False)
    relocation_willingness = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    base_resume = relationship("BaseResume", back_populates="user", uselist=False)
    job_applications = relationship("JobApplication", back_populates="user")

class BaseResume(Base):
    __tablename__ = "base_resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="base_resume")
    resume_versions = relationship("ResumeVersion", back_populates="base_resume")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    source = Column(String, nullable=False)
    url = Column(String, nullable=False)
    salary_range = Column(String, nullable=True)
    work_arrangement = Column(Enum(WorkArrangement), nullable=True)
    industry = Column(String, nullable=True)
    visa_sponsorship = Column(Boolean, default=False)
    relocation_assistance = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    applications = relationship("JobApplication", back_populates="job")

class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(Integer, primary_key=True, index=True)
    base_resume_id = Column(Integer, ForeignKey("base_resumes.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    base_resume = relationship("BaseResume", back_populates="resume_versions")
    job = relationship("Job")
    applications = relationship("JobApplication", back_populates="resume_version")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    resume_version_id = Column(Integer, ForeignKey("resume_versions.id"), nullable=False)
    status = Column(String, nullable=False)  # 'applied', 'seen', 'rejected', 'interview', 'ghosted'
    rejection_reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="job_applications")
    job = relationship("Job", back_populates="applications")
    resume_version = relationship("ResumeVersion", back_populates="applications") 

    print("✅ models.py loaded")