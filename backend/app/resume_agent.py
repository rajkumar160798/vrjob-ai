from openai import OpenAI

class ResumeAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def customize_resume(self, resume_content, job_description):
        prompt = f"""
        Given the resume: {resume_content}
        and the job description: {job_description}

        Return a tailored resume that highlights matching skills and experience.
        """
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
