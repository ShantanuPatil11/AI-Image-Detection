import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

image_path = "test_images/sample.png"

uploaded_file = client.files.upload(
    file=image_path
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        uploaded_file,
        """
Analyze this image.

Return ONLY valid JSON.

{
  "verdict": "Human-Created or AI-Generated",
  "confidence": 0,
  "reasons": [
    "reason 1",
    "reason 2",
    "reason 3"
  ]
}
"""
    ]
)

print(response.text)