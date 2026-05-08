# 🎵 Synchro - Premium Music Experience

**Synchro** es una plataforma de streaming de música de alta fidelidad diseñada para ofrecer una experiencia inmersiva, rápida y personalizada. Inspirada en las mejores interfaces modernas, Synchro combina la potencia de Spotify y YouTube para ofrecer un catálogo infinito con una estética de lujo.

![Synchro Hero](frontend/src/assets/hero.png)

## 🚀 Características Principales

- **🎧 Catálogo Infinito**: Integración con la API de Spotify y YouTube para búsqueda y streaming de cualquier canción.
- **🔐 Sistema de Autenticación Real**: Registro e inicio de sesión persistente con perfiles de usuario personalizados.
- **☁️ Base de Datos en la Nube**: Persistencia total de playlists, favoritos e historial mediante **Supabase (PostgreSQL)**.
- **👤 Perfil Personalizado**: Gestión de cuenta, edición de perfil y estadísticas de escucha.
- **🌓 Diseño Premium**: Interfaz fluida con *glassmorphism*, degradados atmosféricos y micro-animaciones.
- **📦 Cloud Ready**: Configuración preparada para despliegue inmediato en Vercel y Koyeb con Docker.

## 🛠️ Tech Stack

### Frontend
- **React.js** + **Vite**
- **Zustand** (Global State Management)
- **Framer Motion** (Animaciones)
- **Tailwind CSS** (Estilización)
- **Lucide React** (Iconografía)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **yt-dlp** (Motor de extracción de audio)
- **Supabase** (PostgreSQL)
- **Docker** (Containerización)

## 🔧 Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/NAbantoHuaman/Synchro.git
   cd Synchro
   ```

2. **Configurar el Backend:**
   - Ve a la carpeta `backend`.
   - Copia `.env.example` a `.env` y rellena tus credenciales de Spotify y Supabase.
   - Instala dependencias y arranca:
     ```bash
     npm install
     npm run dev
     ```

3. **Configurar el Frontend:**
   - Ve a la carpeta `frontend`.
   - Copia `.env.example` a `.env`.
   - Instala dependencias y arranca:
     ```bash
     npm install
     npm run dev
     ```

## 🌐 Despliegue en Producción

### Backend (Koyeb / Railway)
El proyecto incluye un `Dockerfile`. Simplemente conecta tu repo y la plataforma detectará automáticamente la configuración. No olvides añadir las variables de entorno (`SPOTIFY_CLIENT_ID`, `DATABASE_URL`, etc.).

### Frontend (Vercel)
Despliegue automático conectando el repositorio. Asegúrate de configurar la variable `VITE_API_URL` apuntando a tu backend desplegado.

---
Creado con ❤️ por [NAbantoHuaman](https://github.com/NAbantoHuaman)
