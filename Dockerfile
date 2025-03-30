# Imagen base liviana con Python
FROM python:3.11-slim

# Evita archivos .pyc y mejora logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Crear directorio de trabajo y copiar el código
WORKDIR /app
COPY . /app

# Crear usuario sin root y darle permisos
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# No se necesita CMD aquí, docker-compose lo define con:
# uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload



