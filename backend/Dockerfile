# Usamos una imagen de Node.js como base
FROM node:18-slim

# Forzamos UTF-8 para evitar errores de codificación en yt-dlp/Python
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV PYTHONIOENCODING=utf-8

# Instalamos dependencias del sistema necesarias para yt-dlp y extracción de audio
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python-is-python3 \
    ffmpeg \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instalamos Deno para que yt-dlp resuelva los retos de JS (Signature/n-challenge)
RUN curl -fsSL https://deno.land/install.sh | sh -s -- --dest /usr/local
ENV PATH="/usr/local/bin:$PATH"

# Instalamos yt-dlp globalmente usando pip
RUN pip3 install yt-dlp --break-system-packages

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias de Node
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto TypeScript (si es necesario)
# En este caso, usaremos ts-node para ejecutar directamente o compilaremos a JS
RUN npm install -g typescript ts-node
RUN npx tsc

# Exponemos el puerto que usa el backend
EXPOSE 3001

# Comando para iniciar la aplicación en producción
CMD ["node", "dist/server.js"]
