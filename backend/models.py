from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class LocationPreference(enum.Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"

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
    phone = Column(String, nullable=True)
    location_preference = Column(Enum(LocationPreference), nullable=False)
    years_experience = Column(Integer, nullable=False)
    skills = Column(JSON, nullable=False)  # List of skills
    desired_roles = Column(JSON, nullable=False)  # List of desired roles
    linkedin_url = Column(String, nullable=True)
    salary_expectation = Column(Integer, nullable=True)
    preferred_industries = Column(JSON, nullable=True)  # List of preferred industries
    work_arrangements = Column(JSON, nullable=True)  # List of work arrangements
    visa_sponsorship = Column(Boolean, default=False)
    relocation_willingness = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    base_resume = relationship("BaseResume", back_populates="user", uselist=False)
    resume_versions = relationship("ResumeVersion", back_populates="user")
    job_applications = relationship("JobApplication", back_populates="user")

class BaseResume(Base):
    __tablename__ = "base_resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="base_resume")
    versions = relationship("ResumeVersion", back_populates="base_resume")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    description = Column(Text)
    location = Column(String)
    source = Column(String)  # e.g., "linkedin", "wellfound", "remoteok"
    url = Column(String, unique=True)
    posted_date = Column(DateTime)
    salary_range = Column(String, nullable=True)
    work_arrangement = Column(String, nullable=True)  # e.g., "full_time", "part_time"
    industry = Column(String, nullable=True)
    visa_sponsorship = Column(Boolean, default=False)
    relocation_assistance = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    applications = relationship("JobApplication", back_populates="job")
    resume_versions = relationship("ResumeVersion", back_populates="job")

class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    base_resume_id = Column(Integer, ForeignKey("base_resumes.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="resume_versions")
    base_resume = relationship("BaseResume", back_populates="versions")
    job = relationship("Job", back_populates="resume_versions")
    application = relationship("JobApplication", back_populates="resume_version", uselist=False)

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    resume_version_id = Column(Integer, ForeignKey("resume_versions.id"), nullable=False)
    status = Column(String, default="applied")  # applied, seen, rejected, ghosted, interview
    applied_at = Column(DateTime, default=datetime.utcnow)
    last_status_update = Column(DateTime, default=datetime.utcnow)
    rejection_reason = Column(String, nullable=True)
    response_time = Column(Integer, nullable=True)  # Time in hours between application and response
    
    # Relationships
    user = relationship("User", back_populates="job_applications")
    job = relationship("Job", back_populates="applications")
    resume_version = relationship("ResumeVersion", back_populates="application")
    email_logs = relationship("EmailLog", back_populates="application")

class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("job_applications.id"), nullable=False)
    subject = Column(String)
    body = Column(Text)
    received_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String)  # seen, rejected, interview
    
    # Relationships
    application = relationship("JobApplication", back_populates="email_logs") 