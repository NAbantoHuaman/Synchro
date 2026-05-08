import axios from 'axios';
import ytDlp from 'yt-dlp-exec';

const streamCache = new Map();
const STREAM_CACHE_TTL = 1000 * 60 * 30; // 30 minutos

// Lista de instancias públicas de Piped para mayor fiabilidad
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://api.piped.victr.me',
  'https://pipedapi.leptons.xyz'
];

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
      
      const output = await ytDlp(url, { 
        dumpSingleJson: true,
        format: 'bestaudio/best',
        noCheckCertificate: true,
        noWarnings: true,
        geoBypass: true,
        extractorArgs: 'youtube:player_client=android,web',
        addHeader: ['user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36']
      } as any);
      
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
