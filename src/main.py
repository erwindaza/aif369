from fastapi import FastAPI
from pydantic import BaseModel
import requests

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
    return {"mensaje":"WhatsApp AI funcionando 🚀"}

@app.post("/chat")
async def chat(prompt: ChatPrompt):
    url = "http://localhost:11434/api/generate"
    
    prompt_con_contexto = f"""
    Responde la siguiente pregunta usando estrictamente este contexto:
    {CONTEXTO}
    
    Pregunta: {prompt.prompt}
    
    Respuesta breve y precisa en base al contexto:
    """
    
    data = {
        "model": "mistral",
        "prompt": prompt_con_contexto,
        "stream": False
    }

    response = requests.post(url, json=data)

    if response.status_code == 200:
        result = response.json()
        respuesta = result.get("response", "No hubo respuesta del modelo.")
    else:
        respuesta = "Error al conectar con Ollama/Mistral."

    return {"respuesta": respuesta.strip()}