FROM node:18-slim

# Instala dependencias del sistema necesarias para Puppeteer y Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libxtst6 \
    chromium \
 && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias del bot
RUN npm install

# Copiar código fuente
COPY . .

# Agregar variable de entorno para puppeteer (usa Chromium del sistema)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Docker-compose se encarga de ejecutar el bot