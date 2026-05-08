import ytDlp from 'yt-dlp-exec';
import fs from 'fs';
import path from 'path';
import os from 'os';

const streamCache = new Map();
const STREAM_CACHE_TTL = 1000 * 60 * 30; // 30 minutos

/**
 * Limpia el contenido de las cookies eliminando solo caracteres de control problemáticos,
 * pero preservando tabuladores (\t) y saltos de línea.
 */
function cleanCookies(content: string): string {
  // Solo eliminamos caracteres no-ASCII que NO sean tabuladores o saltos de línea
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
        console.log(`[yt-dlp] >>> STARTING ATTEMPT with client: ${client} for ID: ${videoId}`);
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Construimos un objeto de opciones fresco en cada iteración
        const options: any = { 
          dumpSingleJson: true,
          format: 'bestaudio/best',
          noCheckCertificate: true,
          noWarnings: true,
          geoBypass: true,
          noCacheDir: true, // Evitar persistencia de bloqueos
          noUpdate: true,   // No intentar actualizar el binario en ejecución
          verbose: true,
          extractorArgs: `youtube:player_client=${client}`,
          jsRuntimes: process.env.DENO_PATH ? `deno:${process.env.DENO_PATH}` : 'deno',
          addHeader: [
            'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding: gzip, deflate, br'
          ]
        };

        // Manejo de Cookies
        const cookiesBase64 = process.env.YOUTUBE_COOKIES_BASE64;
        const cookiesPath = process.env.YOUTUBE_COOKIES_PATH || 'cookies.txt';

        if (cookiesBase64 && cookiesBase64.trim().length > 0) {
          const tempFile = path.join(os.tmpdir(), `cookies_${client}_${Date.now()}.txt`);
          let content = Buffer.from(cookiesBase64, 'base64').toString('utf-8');
          content = cleanCookies(content);
          fs.writeFileSync(tempFile, content);
          options.cookies = tempFile;
          console.log(`[yt-dlp] Using cookies from Base64 (temp file: ${tempFile})`);
        } else {
          // Intentar encontrar el archivo en varias ubicaciones posibles
          const searchPaths = [
            path.isAbsolute(cookiesPath) ? cookiesPath : path.join(process.cwd(), cookiesPath),
            path.join(__dirname, '../../', cookiesPath),
            path.join(__dirname, '../', cookiesPath),
            path.join('/app', cookiesPath)
          ];

          let foundPath = null;
          for (const p of searchPaths) {
            if (fs.existsSync(p)) {
              foundPath = p;
              break;
            }
          }

          if (foundPath) {
            options.cookies = foundPath;
            console.log(`[yt-dlp] Cookies found and applied from: ${foundPath}`);
          } else {
            console.error(`[yt-dlp] ⚠️ COOKIES NOT FOUND! Searched in: ${searchPaths.join(', ')}`);
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
        console.log(`✅ [yt-dlp] SUCCESS with client: ${client}`);
        return result;

      } catch (error: any) {
        console.warn(`❌ [yt-dlp] ATTEMPT FAILED with client: ${client}. Error:`, error.message);
        lastError = error;
        // Continuamos al siguiente cliente en la lista
      }
    }

    console.error('Final failure: all yt-dlp clients exhausted.');
    throw new Error(`Audio extraction failed: ${lastError?.message || 'Unknown error'}`);
  }

  static async testCookies(): Promise<string> {
    const videoId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up (video de test)
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    const options: any = { 
      listFormats: true,
      noCheckCertificate: true,
      noWarnings: true,
      verbose: true,
      jsRuntimes: process.env.DENO_PATH ? `deno:${process.env.DENO_PATH}` : 'deno'
    };

    // Manejo de Cookies
    const cookiesBase64 = process.env.YOUTUBE_COOKIES_BASE64;
    const cookiesPath = process.env.YOUTUBE_COOKIES_PATH || 'cookies.txt';

    if (cookiesBase64 && cookiesBase64.trim().length > 0) {
      const tempFile = path.join(os.tmpdir(), `test_cookies_${Date.now()}.txt`);
      let content = Buffer.from(cookiesBase64, 'base64').toString('utf-8');
      content = cleanCookies(content);
      fs.writeFileSync(tempFile, content);
      options.cookies = tempFile;
      console.log(`[test-cookies] Using cookies from Base64 (temp: ${tempFile})`);
    } else {
      const searchPaths = [
        path.isAbsolute(cookiesPath) ? cookiesPath : path.join(process.cwd(), cookiesPath),
        path.join(__dirname, '../../', cookiesPath),
        path.join(__dirname, '../', cookiesPath),
        path.join('/app', cookiesPath)
      ];

      let foundPath = null;
      for (const p of searchPaths) {
        if (fs.existsSync(p)) {
          foundPath = p;
          break;
        }
      }

      if (foundPath) {
        options.cookies = foundPath;
        console.log(`[test-cookies] Cookies found at: ${foundPath}`);
      } else {
        console.error(`[test-cookies] ⚠️ NOT FOUND! Paths: ${searchPaths.join(', ')}`);
      }
    }

    try {
      const output = await ytDlp(url, options);
      return String(output);
    } catch (error: any) {
      throw new Error(`Cookie Test Failed: ${error.message}`);
    }
  }
}
