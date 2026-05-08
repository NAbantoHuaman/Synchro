import axios from 'axios';
import ytDlp from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';
import os from 'os';

const streamCache = new Map();
const STREAM_CACHE_TTL = 1000 * 60 * 30; // 30 minutos

// Lista de instancias públicas de Piped para mayor fiabilidad
// Lista de instancias públicas de Piped para mayor fiabilidad
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.moomoo.me',
  'https://api.piped.privacydev.net',
  'https://piped-api.garudalinux.org',
  'https://pipedapi.leptons.xyz',
  'https://api.piped.projectsegfau.lt'
];

/**
 * Limpia el contenido de las cookies eliminando caracteres no-ASCII que causan errores en Python/yt-dlp
 */
function cleanCookies(content: string): string {
  // Solo permitimos caracteres ASCII imprimibles, tabs y saltos de línea
  return content.replace(/[^\x00-\x7F]/g, '');
}

export class AudioExtractorService {
  static async getStreamUrl(videoId: string): Promise<any> {
    const cached = streamCache.get(videoId);
    if (cached && Date.now() - cached.timestamp < STREAM_CACHE_TTL) {
      console.log('Stream Cache Hit:', videoId);
      return cached.data;
    }

    // Intentar primero con el Proxy de Piped (Más fiable en la nube)
    for (const instance of PIPED_INSTANCES) {
      try {
        console.log(`Trying Proxy: ${instance} for ID: ${videoId}`);
        const response = await axios.get(`${instance}/streams/${videoId}`, { timeout: 5000 });
        
        if (response.data && response.data.audioStreams) {
          // Buscamos el stream de audio con mejor calidad
          const bestAudio = response.data.audioStreams.reduce((prev: any, curr: any) => {
            return (prev.bitrate > curr.bitrate) ? prev : curr;
          });

          const result = {
            url: bestAudio.url,
            bitrate: bestAudio.bitrate,
            format: bestAudio.format || 'm4a',
            proxy: instance
          };

          streamCache.set(videoId, { data: result, timestamp: Date.now() });
          console.log(`✅ Success via Proxy: ${instance}`);
          return result;
        }
      } catch (proxyError: any) {
        console.warn(`Proxy ${instance} failed:`, proxyError.message);
        continue; // Probar la siguiente instancia
      }
    }

    // Si fallan los proxies, intentar como último recurso con yt-dlp local
    try {
      console.log('FALLBACK: Trying local yt-dlp extraction for ID:', videoId);
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      
      const options: any = { 
        dumpSingleJson: true,
        format: 'bestaudio/best',
        noCheckCertificate: true,
        noWarnings: true,
        geoBypass: true,
        extractorArgs: 'youtube:player_client=web,ios,android',
        jsRuntimes: process.env.DENO_PATH ? `deno:${process.env.DENO_PATH}` : 'deno'
      };

      // Si hay una ruta de cookies configurada y el archivo existe, la usamos
      const cookiesPath = process.env.YOUTUBE_COOKIES_PATH;
      const cookiesBase64 = process.env.YOUTUBE_COOKIES_BASE64;

      if (cookiesBase64) {
        // En producción (Render/Vercel), usamos la variable de entorno Base64
        const tempCookiesPath = path.join(os.tmpdir(), `youtube_cookies_${Date.now()}.txt`);
        try {
          let cookiesContent = Buffer.from(cookiesBase64, 'base64').toString('utf-8');
          // Limpiamos caracteres que rompen el codec latin-1 de Python
          cookiesContent = cleanCookies(cookiesContent);
          
          fs.writeFileSync(tempCookiesPath, cookiesContent);
          console.log('Using cookies from YOUTUBE_COOKIES_BASE64 (temp file cleaned)');
          options.cookies = tempCookiesPath;
        } catch (err) {
          console.error('Error decoding YOUTUBE_COOKIES_BASE64:', err);
        }
      } else if (cookiesPath) {
        // En local, usamos el archivo físico
        const fullPath = path.isAbsolute(cookiesPath) 
          ? cookiesPath 
          : path.join(process.cwd(), cookiesPath);
        
        if (fs.existsSync(fullPath)) {
          console.log(`Using cookies from file: ${fullPath}`);
          options.cookies = fullPath;
        } else {
          console.warn(`Cookie file not found at: ${fullPath}`);
        }
      }

      const output = await ytDlp(url, options);
      
      const info = output as any;
      const result = {
        url: info.url,
        bitrate: Math.round(info.abr || 0),
        format: info.ext || 'unknown'
      };

      streamCache.set(videoId, { data: result, timestamp: Date.now() });
      return result;
    } catch (error: any) {
      console.error('FINAL ERROR: All extraction methods failed for ID:', videoId);
      throw new Error(`Audio extraction failed: ${error.message}`);
    }
  }
}
