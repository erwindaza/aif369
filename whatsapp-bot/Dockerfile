FROM node:18-slim

# Instalar dependencias necesarias para Puppeteer/Chromium
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

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Variable de entorno: usar Chromium del sistema
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# El comando se definirá en docker-compose
