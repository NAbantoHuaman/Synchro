# Usar Node.js 20 como base
FROM node:20-slim

# Instalar dependencias del sistema (FFmpeg, Python para yt-dlp, curl para Deno)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instalar Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias desde la carpeta backend
COPY backend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la carpeta backend
COPY backend/ .

# Construir el proyecto
RUN npm run build

# Puerto de Hugging Face
ENV PORT=7860
EXPOSE 7860

# Comando para arrancar
CMD ["npm", "start"]
