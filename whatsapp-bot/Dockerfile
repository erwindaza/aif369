# Imagen base liviana de Node.js con Alpine Linux
FROM node:18-alpine

# Crear el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias primero (para aprovechar la cache)
COPY package*.json ./

# Instalar las dependencias necesarias del bot
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# (Opcional) Exponer un puerto si usas algún tipo de webhook en el futuro
# EXPOSE 3000

# No usamos CMD porque el comando se define en docker-compose.yml
