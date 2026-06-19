from flask import Flask, render_template, request, jsonify
import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"})

    image = request.files["image"]

    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    try:

        uploaded_file = client.files.upload(
            file=filepath
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
  "confidence": 0.0,
  "reasons": [
    "reason 1",
    "reason 2",
    "reason 3"
  ]
}
"""
            ]
        )

        print("\n===== GEMINI RESPONSE =====")
        print(response.text)
        print("===========================\n")

        clean_text = response.text.strip()

        if clean_text.startswith("```json"):
            clean_text = clean_text.replace("```json", "", 1)

        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]

        clean_text = clean_text.strip()

        result = json.loads(clean_text)

        if isinstance(result.get("confidence"), float):
            result["confidence"] = round(result["confidence"] * 100)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(debug=True)