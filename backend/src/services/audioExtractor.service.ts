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
      const url = `https://music.youtube.com/watch?v=${videoId}`;
      
      const output = await ytDlp(url, { 
        dumpSingleJson: true,
        format: 'bestaudio[acodec^=opus]/bestaudio[ext=webm]/bestaudio',
        noCheckCertificate: true,
        noWarnings: true,
        extractorArgs: 'youtube:player_client=web_remix',
        addHeader: [
          'referer:https://music.youtube.com/',
          'origin:https://music.youtube.com/',
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
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
