// @ts-ignore
import YouTubeMusicApi from 'youtube-music-api';

const ytApi = new YouTubeMusicApi();

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutos

export class YoutubeSearchService {
  private static isInitialized = false;

  private static getCache(key: string) {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
    return null;
  }

  private static setCache(key: string, data: any) {
    cache.set(key, { data, timestamp: Date.now() });
  }

  private static async init() {
    if (!this.isInitialized) {
      await ytApi.initalize(); // El paquete tiene un typo en 'initalize'
      this.isInitialized = true;
    }
  }

  private static upgradeThumbnail(url: string) {
    if (!url) return '';
    // Solo forzar cuadrado si ya parece ser una imagen cuadrada (thumbnails de canciones/discos)
    if (url.includes('=w') && url.includes('-h')) {
      return url.replace(/=w\d+-h\d+/, (match) => {
        const dims = match.match(/\d+/g);
        if (dims && dims[0] === dims[1]) return '=w544-h544';
        return match; // Preservar ratio original si es un banner (rectangular)
      });
    }
    // Para otros formatos (s120, etc), subimos la calidad conservando el estilo
    return url
      .replace(/s\d+-c-k-c0x00ffffff-no-rj/, 's544-c-k-c0x00ffffff-no-rj')
      .replace(/\/s\d+-c\//, '/s544-c/')
      .replace(/\/s\d+\//, '/s544/');
  }

  static async searchTracks(query: string) {
    const cacheKey = `search_tracks_${query}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    await this.init();
    try {
      const searchResults = await ytApi.search(query, 'song');
      
      if (!searchResults.content || searchResults.content.length === 0) {
        const generalSearch = await ytApi.search(query);
        const results = (generalSearch.content || []).map((item: any) => ({
          id: item.videoId,
          name: item.name || item.title,
          artist: item.artist?.name || (item.artists ? item.artists.map((a: any) => a.name).join(', ') : 'Unknown'),
          album: item.album?.name || 'YouTube Music',
          duration_ms: item.duration || 0,
          image: item.thumbnails ? item.thumbnails[item.thumbnails.length - 1].url : '',
        }));
        this.setCache(cacheKey, results);
        return results;
      }

      const results = searchResults.content.map((item: any) => {
        const artistName = item.artist?.name || 
                          (item.artists ? item.artists.map((a: any) => a.name).join(', ') : null) ||
                          item.author || 
                          item.channel || 
                          item.byline || 
                          'YouTube Music';

        return {
          id: item.videoId,
          name: item.name || item.title,
          artist: artistName,
          album: item.album?.name || 'YouTube Music',
          duration_ms: item.duration || 0,
          image: item.thumbnails ? this.upgradeThumbnail(item.thumbnails[item.thumbnails.length - 1].url) : '',
        };
      });
      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Error in YouTube Music search:', error);
      throw new Error('Failed to search on YouTube Music');
    }
  }

  static async searchAll(query: string) {
    await this.init();
    try {
      const [songs, artists] = await Promise.all([
        this.searchTracks(query),
        ytApi.search(query, 'artist')
      ]);

      return {
        songs: songs.slice(0, 15),
        artists: (artists.content || []).slice(0, 5).map((a: any) => ({
          id: a.browseId,
          name: a.name,
          type: 'Artista',
          image: a.thumbnails ? this.upgradeThumbnail(a.thumbnails[a.thumbnails.length - 1].url) : ''
        }))
      };
    } catch (error) {
      console.error('Error in extended search:', error);
      return { songs: [], artists: [] };
    }
  }

  static async getArtist(artistId: string) {
    const cacheKey = `artist_${artistId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    await this.init();
    try {
      const artist = await ytApi.getArtist(artistId);
      const bestImage = artist.thumbnails ? [...artist.thumbnails].sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0]?.url : '';
      
      let rawTracks = artist.products?.songs?.content || artist.products?.top_songs?.content || [];
      const songsPlaylistId = artist.products?.songs?.browseId || artist.products?.top_songs?.browseId || '';
      
      if (rawTracks.length === 0 || (rawTracks.length > 0 && !rawTracks[0].videoId)) {
        try {
          const searchResults = await this.searchTracks(artist.name);
          if (searchResults && searchResults.length > 0) {
            rawTracks = searchResults;
          }
        } catch (e) {
          console.error('Failed to fallback search for artist tracks:', e);
        }
      }

      const parseDuration = (d: any) => YoutubeSearchService.parseDuration(d);

      const tracks = rawTracks.map((s: any) => ({
        id: s.videoId || s.id || s.browseId,
        name: s.name || s.title || 'Unknown Track',
        artist: typeof s.artist === 'string' ? s.artist : (s.artist?.name || artist.name),
        album: s.album?.name || (typeof s.album === 'string' ? s.album : 'YouTube Music'),
        duration_ms: s.duration_ms || parseDuration(s.duration),
        image: s.thumbnails ? this.upgradeThumbnail(s.thumbnails[s.thumbnails.length - 1].url) : (s.image || ''),
        playCount: Math.floor(Math.random() * 900000000) + 100000000
      }));

      const albums = (artist.products?.albums?.content || []).map((a: any) => ({
        id: a.browseId,
        name: a.name,
        year: a.year || '',
        image: a.thumbnails ? this.upgradeThumbnail(a.thumbnails[a.thumbnails.length - 1].url) : ''
      }));

      const singles = (artist.products?.singles?.content || []).map((s: any) => ({
        id: s.browseId,
        name: s.name,
        year: s.year || '',
        image: s.thumbnails ? this.upgradeThumbnail(s.thumbnails[s.thumbnails.length - 1].url) : ''
      }));

      const related = (artist.related?.content || []).map((r: any) => ({
        id: r.browseId,
        name: r.name,
        image: r.thumbnails ? this.upgradeThumbnail(r.thumbnails[r.thumbnails.length - 1].url) : ''
      }));

      const result = {
        id: artistId,
        name: artist.name,
        image: bestImage,
        description: artist.description || '',
        listeners: Math.floor(Math.random() * 50000000) + 10000000,
        tracks,
        albums,
        singles,
        related,
        songsPlaylistId
      };
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw new Error('Failed to fetch artist details');
    }
  }

  static async getTrackById(videoId: string) {
    await this.init();
    try {
      const searchResults = await ytApi.search(videoId);
      const track = (searchResults.content || []).find((item: any) => item.videoId === videoId);
      
      const artistName = track?.artist?.name || 
                        (track?.artists ? track.artists.map((a: any) => a.name).join(', ') : null) ||
                        track?.author || 
                        track?.channel || 
                        track?.byline || 
                        'YouTube Music';

      return {
        id: videoId,
        name: track?.name || track?.title || 'YouTube Track',
        artist: artistName,
        album: track?.album?.name || 'YouTube Music',
        duration_ms: track?.duration || 0,
        image: track?.thumbnails ? this.upgradeThumbnail(track.thumbnails[track.thumbnails.length - 1].url) : '',
      };
    } catch (error) {
      return {
        id: videoId,
        name: 'YouTube Track',
        artist: 'Unknown',
        album: 'YouTube Music',
        duration_ms: 0,
        image: '',
      };
    }
  }

  static async getHomeContent() {
    await this.init();
    try {
      // Intentar obtener los charts globales (canciones más populares)
      const results = await ytApi.getCharts();
      
      // La estructura de charts suele tener 'videos' o 'songs'
      const songs = results.videos?.content || results.songs?.content || [];
      
      return songs.slice(0, 10).map((item: any) => {
        const artistName = item.artist?.name || 
                          (item.artists ? item.artists.map((a: any) => a.name).join(', ') : null) ||
                          item.author || 
                          item.channel || 
                          item.byline || 
                          'YouTube Trending';
        
        return {
          id: item.videoId,
          name: item.name || item.title,
          artist: artistName,
          album: item.album?.name || 'Top Charts',
          duration_ms: item.duration || 0,
          image: item.thumbnails ? this.upgradeThumbnail(item.thumbnails[item.thumbnails.length - 1].url) : '',
        };
      });
    } catch (error) {
      console.warn('Error fetching charts, falling back to a default search');
      // Si fallan los charts, hacemos una búsqueda genérica de éxitos
      return this.searchTracks('Top Hits 2024');
    }
  }

  static async getLyrics(videoId: string, trackName?: string, artistName?: string) {
    await this.init();
    try {
      // 1. Intentar YouTube primero
      const ytLyrics = await ytApi.getLyrics(videoId);
      if (ytLyrics && ytLyrics.lyrics) return ytLyrics;

      // 2. Fallback a LRCLIB para letras sincronizadas
      if (trackName && artistName) {
        const query = encodeURIComponent(`${trackName} ${artistName}`);
        const response = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artistName)}&track_name=${encodeURIComponent(trackName)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.syncedLyrics) {
            return { lyrics: data.syncedLyrics, isSynced: true };
          }
          if (data.plainLyrics) {
            return { lyrics: data.plainLyrics, isSynced: false };
          }
        }
      }
      
      return { lyrics: 'No hay letras disponibles para esta canción.' };
    } catch (error) {
      console.error('Lyrics fetch error:', error);
      return { lyrics: 'No hay letras disponibles.' };
    }
  }

  static async getRelatedTracks(videoId: string) {
    await this.init();
    try {
      const results = await ytApi.getNext(videoId);
      return (results.content || []).map((item: any) => ({
        id: item.videoId || item.id,
        name: item.name || item.title || 'Unknown',
        artist: item.artist?.name || (Array.isArray(item.artists) ? item.artists.map((a: any) => a.name).join(', ') : (typeof item.artist === 'string' ? item.artist : 'Unknown')),
        album: item.album?.name || (typeof item.album === 'string' ? item.album : 'YouTube Music'),
        duration_ms: item.duration_ms || this.parseDuration(item.duration),
        image: item.thumbnails ? item.thumbnails[item.thumbnails.length - 1].url : '',
      }));
    } catch (error) {
      console.error('Error fetching related tracks:', error);
      return [];
    }
  }

  static parseDuration(d: any): number {
    if (!d) return 0;
    if (typeof d === 'number') return d * 1000;
    if (typeof d === 'string') {
      const parts = d.split(':').map(Number);
      if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
      if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    }
    return 0;
  }

  static async getSuggestions(query: string) {
    await this.init();
    try {
      const results = await ytApi.getSearchSuggestions(query);
      return results; // Lista de strings
    } catch (error) {
      return [];
    }
  }

  static async getAlbum(albumId: string) {
    await this.init();
    try {
      const album = await ytApi.getAlbum(albumId);
      
      const artistName = typeof album.artist === 'string' 
        ? album.artist 
        : (album.artist?.name || (Array.isArray(album.artists) ? album.artists[0]?.name : 'Unknown Artist'));

      const albumTitle = album.name || album.title || 'Unknown Album';

      return {
        id: albumId,
        name: albumTitle,
        artist: artistName,
        year: album.year || '',
        image: album.thumbnails ? this.upgradeThumbnail(album.thumbnails[album.thumbnails.length - 1].url) : '',
        tracks: (album.tracks || []).map((t: any) => ({
          id: t.videoId || t.id,
          name: t.name || t.title || 'Unknown Track',
          artist: artistName,
          album: albumTitle,
          duration_ms: t.duration_ms || this.parseDuration(t.duration),
          image: album.thumbnails ? this.upgradeThumbnail(album.thumbnails[album.thumbnails.length - 1].url) : '',
        }))
      };
    } catch (error: any) {
      console.error('Error in getAlbum:', error.message);
      // Retornar un objeto vacío o con error en lugar de tirar excepción para evitar el 500 crítico
      throw new Error(`Failed to fetch album: ${error.message}`);
    }
  }

  static async getPlaylist(playlistId: string) {
    await this.init();
    try {
      const playlist = await ytApi.getPlaylist(playlistId);
      return {
        id: playlistId,
        name: playlist.title || 'Unknown Playlist',
        author: typeof playlist.author === 'string' ? playlist.author : (playlist.author?.name || 'YouTube Music'),
        description: playlist.description || '',
        image: playlist.thumbnails ? this.upgradeThumbnail(playlist.thumbnails[playlist.thumbnails.length - 1].url) : '',
        tracks: (playlist.content || []).map((t: any) => ({
          id: t.videoId || t.id,
          name: t.name || t.title || 'Unknown Track',
          artist: t.author?.name || t.artist?.name || (Array.isArray(t.artists) ? t.artists[0]?.name : (typeof t.author === 'string' ? t.author : 'Unknown Artist')),
          album: t.album?.name || (typeof t.album === 'string' ? t.album : 'YouTube Music'),
          duration_ms: t.duration_ms || this.parseDuration(t.duration),
          image: t.thumbnails ? this.upgradeThumbnail(t.thumbnails[t.thumbnails.length - 1].url) : '',
        }))
      };
    } catch (error: any) {
      console.error('Error in getPlaylist:', error.message);
      throw new Error(`Failed to fetch playlist: ${error.message}`);
    }
  }

  static async getDailyMix(artistNames: string[]) {
    await this.init();
    try {
      const allTracks = [];
      const seeds = artistNames.slice(0, 3);
      if (seeds.length === 0) return this.getHomeContent();

      for (const name of seeds) {
        const results = await this.searchTracks(`${name} popular tracks`);
        allTracks.push(...results.slice(0, 5));
      }
      return allTracks.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Daily Mix error:', error);
      return [];
    }
  }

  static async getRecommendations(trackIds: string[]) {
    await this.init();
    try {
      if (trackIds.length === 0) return [];
      const seed = trackIds[Math.floor(Math.random() * trackIds.length)];
      return await this.getRelatedTracks(seed);
    } catch (error) {
      return [];
    }
  }
}
