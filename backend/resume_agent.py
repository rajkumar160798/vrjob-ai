import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class ResumeAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    def customize_resume(self, resume_content: str, job_description: str) -> str:
        """
        Customizes a resume based on the job description using GPT-4
        """
        prompt = f"""
        You are an expert resume writer. Customize the following resume to match the job description.
        Focus on highlighting relevant skills and experiences that match the job requirements.
        Keep the same format and structure, but modify the content to be more relevant.
        
        Job Description:
        {job_description}
        
        Original Resume:
        {resume_content}
        
        Return the customized resume in the same format as the original.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert resume writer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error customizing resume: {str(e)}") 