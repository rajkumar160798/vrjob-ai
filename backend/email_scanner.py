import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import pickle
from typing import List, Dict

class EmailScanner:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
        self.creds = None
        self.service = None
        
    def authenticate(self):
        """Authenticate with Gmail API"""
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                self.creds = pickle.load(token)
                
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', self.SCOPES)
                self.creds = flow.run_local_server(port=0)
                
            with open('token.pickle', 'wb') as token:
                pickle.dump(self.creds, token)
                
        self.service = build('gmail', 'v1', credentials=self.creds)
        
    def scan_emails(self) -> List[Dict]:
        """Scan emails for job application statuses"""
        if not self.service:
            self.authenticate()
            
        try:
            # Get emails from the last 30 days
            query = f'after:{(datetime.now() - timedelta(days=30)).strftime("%Y/%m/%d")}'
            results = self.service.users().messages().list(
                userId='me',
                q=query
            ).execute()
            
            messages = results.get('messages', [])
            email_logs = []
            
            for message in messages:
                msg = self.service.users().messages().get(
                    userId='me',
                    id=message['id']
                ).execute()
                
                headers = msg['payload']['headers']
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
                date = next((h['value'] for h in headers if h['name'] == 'Date'), '')
                
                # Simple status detection based on subject
                status = self._detect_status(subject)
                
                if status:
                    email_logs.append({
                        'subject': subject,
                        'date': date,
                        'status': status
                    })
                    
            return email_logs
            
        except Exception as e:
            raise Exception(f"Error scanning emails: {str(e)}")
            
    def _detect_status(self, subject: str) -> str:
        """Detect application status from email subject"""
        subject = subject.lower()
        
        if any(word in subject for word in ['rejection', 'unfortunately', 'not moving forward']):
            return 'rejected'
        elif any(word in subject for word in ['application received', 'thank you for applying']):
            return 'received'
        elif any(word in subject for word in ['interview', 'next steps']):
            return 'interview'
        return None 