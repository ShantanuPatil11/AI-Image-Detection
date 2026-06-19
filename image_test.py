import os
import json
from dotenv import load_dotenv
from google import genai
from PIL import Image

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

image = Image.open("test_images/sample.png")

prompt = """
Analyze this image.

Estimate whether it appears AI-generated or human-created.

Return ONLY valid JSON in this format:

{
  "verdict": "Likely AI Generated",
  "confidence": 84,
  "confidence_reason": "Brief explanation of confidence.",
  "reasons": [
    "Reason 1",
    "Reason 2",
    "Reason 3"
  ]
}
"""

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[prompt, image]
)

print(response.text)