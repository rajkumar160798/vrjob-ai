from typing import List, Dict
import random
from datetime import datetime, timedelta

class JobScraper:
    def __init__(self):
        self.companies = [
            "Google", "Microsoft", "Apple", "Amazon", "Meta",
            "Netflix", "Tesla", "SpaceX", "Uber", "Airbnb"
        ]
        self.job_titles = [
            "Software Engineer", "Data Scientist", "Product Manager",
            "Machine Learning Engineer", "DevOps Engineer",
            "Frontend Developer", "Backend Developer", "Full Stack Developer"
        ]
        
    def search_jobs(self, keywords: str = "", location: str = "") -> List[Dict]:
        """
        Simulates job search with dummy data
        """
        jobs = []
        for i in range(10):
            job = {
                "id": i + 1,
                "title": random.choice(self.job_titles),
                "company": random.choice(self.companies),
                "description": f"This is a sample job description for a {random.choice(self.job_titles)} position at {random.choice(self.companies)}.",
                "location": random.choice(["Remote", "San Francisco", "New York", "Seattle", "Austin"]),
                "posted_date": (datetime.now() - timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
                "status": "new"
            }
            jobs.append(job)
            
        return jobs 