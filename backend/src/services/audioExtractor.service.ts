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

    const clients = ['tv', 'web', 'mweb', 'ios', 'android', 'web_embedded', 'android_embedded'];
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
          noCacheDir: true,
          noUpdate: true,
          verbose: true,
          extractorArgs: `youtube:player_client=${client}`,
          jsRuntimes: process.env.DENO_PATH ? `deno:${process.env.DENO_PATH}` : 'deno'
        };

        // Manejo de Cookies: Solo las usamos para el cliente 'web'
        // Las cookies de navegador suelen romper los clientes ios/android
        if (client === 'web') {
          const cookiesBase64 = process.env.YOUTUBE_COOKIES_BASE64;
          const cookiesPath = process.env.YOUTUBE_COOKIES_PATH || 'cookies.txt';

          if (cookiesBase64 && cookiesBase64.trim().length > 0) {
            const tempFile = path.join(os.tmpdir(), `cookies_${client}_${Date.now()}.txt`);
            let content = Buffer.from(cookiesBase64, 'base64').toString('utf-8');
            content = cleanCookies(content);
            fs.writeFileSync(tempFile, content);
            options.cookies = tempFile;
            console.log(`[yt-dlp] Using cookies from Base64 for web client`);
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
              console.log(`[yt-dlp] Cookies found for web client at: ${foundPath}`);
            }
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

  static async testCookies(videoId: string = 'cy6Arnjp-hQ'): Promise<string> {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`[test-cookies] testing with videoId: ${videoId}`);
    
    const options: any = { 
      listFormats: true,
      noCheckCertificate: true,
      noWarnings: true,
      verbose: true,
      extractorArgs: 'youtube:player_client=tv',
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
