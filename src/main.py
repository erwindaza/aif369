from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os

MODEL_NAME = os.getenv("MODEL_NAME", "mistral")  # Default es 'phi' por si no está en .env

app = FastAPI(
    title="AIF369 WhatsApp Bot",
    description="WhatsApp Bot integrado con Ollama y contexto específico",
    version="1.1.0"
)

class ChatPrompt(BaseModel):
    prompt: str

# Leer contexto desde archivo
with open("contexto.txt", "r", encoding="utf-8") as file:
    CONTEXTO = file.read()

@app.get("/")
async def home():
    return {"mensaje": "WhatsApp AI funcionando 🚀"}

@app.post("/chat")
async def chat(prompt: ChatPrompt):
    url = "http://host.docker.internal:11434/api/generate"

    prompt_con_contexto = f"""
Eres Sofía, una asistente virtual de AI Factory 369 que responde con precisión usando el siguiente contexto.

[Contexto]:
{CONTEXTO}

[Mensaje del usuario]:
{prompt.prompt}

[Respuesta clara, corta (máx. 100 caracteres y si te falta usa unpoco mas para dar la respuesta completa y que no quede cortadas las palabras por esta resctriccion, termianr una respuesta, termina las respuestas ), en el mismo idioma que el usuario, sin inventar nada]:
"""

    data = {
        "model": MODEL_NAME,
        "prompt": prompt_con_contexto,
        "stream": False,
        "options": {
            "num_predict": 150
        }
    }

    response = requests.post(url, json=data)

    if response.status_code == 200:
        result = response.json()
        respuesta = result.get("response", "No hubo respuesta del modelo.")
    else:
        respuesta = "Error al conectar con Ollama/Mistral."

    return {"respuesta": respuesta.strip()}
