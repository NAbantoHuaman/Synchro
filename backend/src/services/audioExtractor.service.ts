import ytDlp from 'yt-dlp-exec';

const streamCache = new Map();
const STREAM_CACHE_TTL = 1000 * 60 * 30; // 30 minutos

export class AudioExtractorService {
  static async getStreamUrl(videoId: string): Promise<any> {
    const cached = streamCache.get(videoId);
    if (cached && Date.now() - cached.timestamp < STREAM_CACHE_TTL) {
      console.log('Stream Cache Hit:', videoId);
      return cached.data;
    }

    try {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      
      const output = await ytDlp(url, { 
        dumpSingleJson: true,
        format: 'bestaudio/best',
        noCheckCertificate: true,
        noWarnings: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        geoBypass: true,
        extractorArgs: 'youtube:player_client=android,web',
        addHeader: [
          'user-agent:Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0'
        ]
      } as any);
      
      const info = output as any;
      const bestAudio = (info.formats || []).find((f: any) => f.url === info.url) || info;

      const result = {
        url: info.url || bestAudio.url,
        bitrate: Math.round(info.abr || bestAudio.abr || 0),
        format: info.ext || bestAudio.ext || 'unknown'
      };

      streamCache.set(videoId, { data: result, timestamp: Date.now() });
      return result;
    } catch (error: any) {
      console.error('CRITICAL: yt-dlp extraction failed for ID:', videoId);
      console.error('Error details:', error.stderr || error.message);
      throw new Error(`Audio extraction failed: ${error.message || 'Internal Error'}`);
    }
  }
}
