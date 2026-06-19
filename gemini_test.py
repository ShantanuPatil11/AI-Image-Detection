import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

response = model.generate_content("""
You are an AI image forensic assistant.

Return ONLY valid JSON.

Example format:

{
  "verdict": "Likely AI Generated",
  "confidence": 84,
  "reasons": [
    "Synthetic texture consistency",
    "Unusual lighting transitions"
  ]
}

Now return a test response.
""")

print(response.text)