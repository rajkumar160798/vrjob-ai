#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up VRJob AI development environment...${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3 and try again.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js and try again.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

# Create and activate virtual environment
echo -e "${YELLOW}Setting up Python virtual environment...${NC}"
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv requests beautifulsoup4

# Install Node.js dependencies
echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
cd frontend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOL
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vrjob_ai

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Gmail API
GMAIL_CLIENT_ID=your_gmail_client_id_here
GMAIL_CLIENT_SECRET=your_gmail_client_secret_here

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOL
    echo -e "${YELLOW}Please update the .env file with your actual API keys and credentials.${NC}"
fi

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${YELLOW}To start the backend server, run:${NC}"
echo -e "source venv/bin/activate && cd backend && uvicorn main:app --reload"
echo -e "${YELLOW}To start the frontend server, run:${NC}"
echo -e "cd frontend && npm start" 