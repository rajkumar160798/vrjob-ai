# VRJob AI - Intelligent Job Application Assistant

VRJob AI is an intelligent agent that automates and optimizes the job application process. It helps job seekers by automatically finding and applying to jobs, customizing resumes, and tracking application statuses.

## Features

- **Automated Job Search**: Finds relevant job postings on LinkedIn and job boards
- **Smart Resume Customization**: Uses GPT-4 to tailor resumes for each job application
- **Email Monitoring**: Tracks application status through Gmail integration
- **Dashboard Analytics**: Visualizes application metrics and statuses
- **Referral Management**: Automates referral request emails

## Tech Stack

### Backend
- Python 3.8+
- FastAPI
- SQLite
- OpenAI API
- Gmail API

### Frontend
- React
- TailwindCSS
- Recharts
- Axios

## Project Structure

```
vrjob-ai/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── resume_agent.py      # OpenAI-powered resume customization
│   ├── job_scraper.py       # Job search and scraping
│   ├── email_scanner.py     # Gmail integration
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main application
│   └── package.json        # Node dependencies
└── README.md
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key
   - Add Gmail API credentials

4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /jobs` - Get all job applications
- `POST /apply` - Apply to a job
- `GET /status/{job_id}` - Get application status
- `POST /resume` - Customize resume for a job
- `GET /email-scan` - Scan Gmail for application updates

## Future Roadmap

- [ ] LinkedIn integration for job search
- [ ] Automated job application submission
- [ ] Resume template management
- [ ] Interview preparation assistant
- [ ] Salary negotiation guidance
- [ ] Company research integration
- [ ] Multi-email account support
- [ ] Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 
