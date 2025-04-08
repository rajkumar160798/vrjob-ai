from typing import List, Dict
from sqlalchemy.orm import Session
from ..users.models import User, Job, ResumeVersion, JobApplication
from ..resume_agent import ResumeAgent
from datetime import datetime
import random

class JobSearchService:
    def __init__(self, db: Session):
        self.db = db
        self.resume_agent = ResumeAgent()
        
    def search_jobs_for_user(self, user: User) -> List[Job]:
        """
        Search for jobs matching user's preferences
        """
        # For now, return dummy jobs. In production, this would call actual job boards
        jobs = []
        for i in range(5):  # Generate 5 dummy jobs
            job = Job(
                title=random.choice(user.desired_roles),
                company=f"Company {i+1}",
                description=f"Looking for a {random.choice(user.desired_roles)} with experience in {', '.join(random.sample(user.skills, 3))}",
                location=user.location_preference,
                source="dummy",
                url=f"https://example.com/job/{i+1}",
                posted_date=datetime.utcnow()
            )
            self.db.add(job)
            jobs.append(job)
        
        self.db.commit()
        return jobs
    
    def customize_resume_for_job(self, user: User, job: Job) -> ResumeVersion:
        """
        Generate a customized resume version for a specific job
        """
        base_resume = user.base_resume
        if not base_resume:
            raise ValueError("User has no base resume")
        
        # Get the customized resume content from GPT-4
        customized_content = self.resume_agent.customize_resume(
            resume_content=base_resume.content,
            job_description=job.description
        )
        
        # Create a new resume version
        resume_version = ResumeVersion(
            user_id=user.id,
            base_resume_id=base_resume.id,
            job_id=job.id,
            content=customized_content
        )
        
        self.db.add(resume_version)
        self.db.commit()
        self.db.refresh(resume_version)
        
        return resume_version
    
    def apply_to_job(self, user: User, job: Job, resume_version: ResumeVersion) -> JobApplication:
        """
        Create a job application record
        """
        application = JobApplication(
            user_id=user.id,
            job_id=job.id,
            resume_version_id=resume_version.id,
            status="applied"
        )
        
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        
        return application
    
    def process_jobs_for_user(self, user: User) -> List[JobApplication]:
        """
        Full pipeline: search jobs, customize resumes, and apply
        """
        # Search for matching jobs
        jobs = self.search_jobs_for_user(user)
        applications = []
        
        for job in jobs:
            try:
                # Customize resume for the job
                resume_version = self.customize_resume_for_job(user, job)
                
                # Apply to the job
                application = self.apply_to_job(user, job, resume_version)
                applications.append(application)
                
            except Exception as e:
                print(f"Error processing job {job.id}: {str(e)}")
                continue
        
        return applications 