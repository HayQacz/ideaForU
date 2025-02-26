import re
import os
import json
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@api_view(['POST'])
def generate_ideas(request):
    topic = request.data.get('topic')
    keywords = request.data.get('keywords')

    if not topic or not keywords:
        return Response({"error": "Topic i keywords są wymagane."}, status=status.HTTP_400_BAD_REQUEST)

    # Prompt dla modelu deepseek-r1:8b
    prompt = f"""You are an AI assistant generating creative ideas based on a given topic and keywords.

Topic: {topic}
Keywords: {keywords}

Generate five ideas in JSON format. Each idea should have the following fields:
- title: A short, catchy title.
- subject: Same as the topic.
 description: A list of exactly six bullet points. Each bullet point should be a short line describing one aspect of the idea.
- budget: A predicted budget(in $ and return value and $ for example 500$ or 150-200$) or the word None if not applicable.
- time: Estimated time for realization(months, weeks, days, etc). 

Ensure the output is **strictly valid JSON**, formatted as a **list of exactly five objects**. Do **not include any explanations, comments, or markdown syntax**.
"""

    payload = {
        "model": "llama3.2",  # Nazwa modelu w Ollama
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        data = response.json()

        # Pobieramy wygenerowany tekst
        generated_text = data.get("response", "").strip()

        # 🔹 **Usuwamy wszystko poza JSON-em**:
        match = re.search(r'\[\s*{.*?}\s*\]', generated_text, re.DOTALL)  # Szukamy czystego JSON-a
        if match:
            json_text = match.group(0).strip()  # Pobieramy czysty JSON
            ideas = json.loads(json_text)  # Parsujemy JSON
            return Response(ideas)
        else:
            return Response({"error": "Nie znaleziono poprawnego JSON-a", "raw": generated_text}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except requests.exceptions.RequestException as e:
        return Response({"error": f"Request failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except json.JSONDecodeError:
        return Response({"error": "Ollama did not return a valid JSON", "raw": generated_text}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
