import ytDlp from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';
import os from 'os';

const streamCache = new Map();
const STREAM_CACHE_TTL = 1000 * 60 * 30; // 30 minutos

/**
 * Limpia el contenido de las cookies eliminando caracteres no-ASCII que causan errores en Python/yt-dlp
 */
function cleanCookies(content: string): string {
  return content.replace(/[^\x00-\x7F]/g, '');
}

export class AudioExtractorService {
  static async getStreamUrl(videoId: string): Promise<any> {
    const cached = streamCache.get(videoId);
    if (cached && Date.now() - cached.timestamp < STREAM_CACHE_TTL) {
      console.log('Stream Cache Hit:', videoId);
      return cached.data;
    }

    const clients = ['web', 'ios', 'android'];
    let lastError = null;

    for (const client of clients) {
      try {
        console.log(`[yt-dlp] Attempting extraction with client: ${client} for ID: ${videoId}`);
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        
        const options: any = { 
          dumpSingleJson: true,
          format: 'bestaudio/best',
          noCheckCertificate: true,
          noWarnings: true,
          geoBypass: true,
          verbose: true, // Activado temporalmente para debug
          extractorArgs: `youtube:player_client=${client}`,
          jsRuntimes: process.env.DENO_PATH ? `deno:${process.env.DENO_PATH}` : 'deno'
        };

        // User-Agent específico según el cliente para evitar HTTP 400
        if (client === 'web') {
          options.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
        } else if (client === 'ios') {
          options.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
        } else if (client === 'android') {
          options.userAgent = 'com.google.android.youtube/19.09.37 (Linux; U; Android 11)';
        }

        // Manejo de Cookies
        const cookiesPath = process.env.YOUTUBE_COOKIES_PATH;
        const cookiesBase64 = process.env.YOUTUBE_COOKIES_BASE64;

        if (cookiesBase64) {
          const tempCookiesPath = path.join(os.tmpdir(), `youtube_cookies_${Date.now()}.txt`);
          let cookiesContent = Buffer.from(cookiesBase64, 'base64').toString('utf-8');
          cookiesContent = cleanCookies(cookiesContent);
          fs.writeFileSync(tempCookiesPath, cookiesContent);
          options.cookies = tempCookiesPath;
        } else if (cookiesPath) {
          const fullPath = path.isAbsolute(cookiesPath) ? cookiesPath : path.join(process.cwd(), cookiesPath);
          if (fs.existsSync(fullPath)) {
            options.cookies = fullPath;
          }
        }

        const output = await ytDlp(url, options);
        const info = output as any;
        
        const result = {
          url: info.url,
          bitrate: Math.round(info.abr || 0),
          format: info.ext || 'unknown',
          client: client
        };

        streamCache.set(videoId, { data: result, timestamp: Date.now() });
        console.log(`✅ [yt-dlp] Success with client: ${client}`);
        return result;

      } catch (error: any) {
        console.warn(`[yt-dlp] Client ${client} failed:`, error.message);
        lastError = error;
        continue; // Intentar con el siguiente cliente
      }
    }

    console.error('FINAL ERROR: All extraction clients failed for ID:', videoId);
    throw new Error(`Audio extraction failed after trying all clients: ${lastError?.message}`);
  }
}
