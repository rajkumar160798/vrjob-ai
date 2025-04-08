from typing import List, Dict
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from ..users.models import Job
from sqlalchemy.orm import Session
import json
import os

class JobBoardService:
    def __init__(self, db: Session):
        self.db = db
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def search_linkedin(self, keywords: str, location: str = None) -> List[Dict]:
        """Search LinkedIn jobs using their API"""
        try:
            # In production, use LinkedIn's official API
            # For now, return dummy data
            return [
                {
                    "title": f"Senior {keywords} Developer",
                    "company": "Tech Corp",
                    "description": f"Looking for a {keywords} developer with 5+ years experience",
                    "location": location or "Remote",
                    "url": "https://linkedin.com/jobs/view/123",
                    "posted_date": datetime.now().isoformat()
                }
            ]
        except Exception as e:
            print(f"Error searching LinkedIn: {str(e)}")
            return []

    def search_wellfound(self, keywords: str) -> List[Dict]:
        """Search Wellfound (formerly AngelList) jobs"""
        try:
            # In production, use Wellfound's API
            # For now, return dummy data
            return [
                {
                    "title": f"{keywords} Engineer",
                    "company": "Startup Inc",
                    "description": f"Join our team as a {keywords} engineer",
                    "location": "Remote",
                    "url": "https://wellfound.com/jobs/123",
                    "posted_date": datetime.now().isoformat()
                }
            ]
        except Exception as e:
            print(f"Error searching Wellfound: {str(e)}")
            return []

    def search_remoteok(self, keywords: str) -> List[Dict]:
        """Search RemoteOK jobs"""
        try:
            url = f"https://remoteok.com/api?tags={keywords}"
            response = requests.get(url, headers=self.headers)
            data = response.json()
            
            jobs = []
            for job in data:
                jobs.append({
                    "title": job.get("position"),
                    "company": job.get("company"),
                    "description": job.get("description"),
                    "location": "Remote",
                    "url": job.get("url"),
                    "posted_date": job.get("date")
                })
            return jobs
        except Exception as e:
            print(f"Error searching RemoteOK: {str(e)}")
            return []

    def search_weworkremotely(self, keywords: str) -> List[Dict]:
        """Search WeWorkRemotely jobs"""
        try:
            url = f"https://weworkremotely.com/remote-jobs/search?term={keywords}"
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            jobs = []
            for job in soup.find_all('li', class_='feature'):
                jobs.append({
                    "title": job.find('span', class_='title').text,
                    "company": job.find('span', class_='company').text,
                    "description": job.find('span', class_='description').text,
                    "location": "Remote",
                    "url": f"https://weworkremotely.com{job.find('a')['href']}",
                    "posted_date": datetime.now().isoformat()
                })
            return jobs
        except Exception as e:
            print(f"Error searching WeWorkRemotely: {str(e)}")
            return []

    def search_all_boards(self, keywords: str, location: str = None) -> List[Job]:
        """Search all job boards and save results to database"""
        all_jobs = []
        
        # Search each job board
        all_jobs.extend(self.search_linkedin(keywords, location))
        all_jobs.extend(self.search_wellfound(keywords))
        all_jobs.extend(self.search_remoteok(keywords))
        all_jobs.extend(self.search_weworkremotely(keywords))
        
        # Save to database
        saved_jobs = []
        for job_data in all_jobs:
            job = Job(
                title=job_data["title"],
                company=job_data["company"],
                description=job_data["description"],
                location=job_data["location"],
                source=job_data.get("source", "unknown"),
                url=job_data["url"],
                posted_date=datetime.fromisoformat(job_data["posted_date"])
            )
            self.db.add(job)
            saved_jobs.append(job)
        
        self.db.commit()
        return saved_jobs 