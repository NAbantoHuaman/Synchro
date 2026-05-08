import spotifyApi from '../config/spotify.config';

export class SpotifyService {
  static async searchTracks(query: string) {
    try {
      const response = await spotifyApi.searchTracks(query, { limit: 10, market: 'US' });
      return response.body.tracks?.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        album: track.album.name,
        duration_ms: track.duration_ms,
        image: track.album.images[0]?.url,
      })) || [];
    } catch (error: any) {
      console.error('Error in Spotify search:', JSON.stringify(error, null, 2));
      throw new Error('Failed to search tracks on Spotify');
    }
  }

  static async getTrackById(id: string) {
    try {
      const response = await spotifyApi.getTrack(id);
      const track = response.body;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        album: track.album.name,
        duration_ms: track.duration_ms,
        image: track.album.images[0]?.url,
      };
    } catch (error) {
      console.error('Error getting Spotify track:', error);
      throw new Error('Track not found on Spotify');
    }
  }
}
