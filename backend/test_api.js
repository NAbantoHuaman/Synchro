const YouTubeMusicApi = require('youtube-music-api');
const yt = new YouTubeMusicApi();

// Simulación simplificada de la clase para probar la lógica nueva
class TestService {
  static async init() {
    await yt.initalize();
  }
  
  static async searchTracks(query) {
    const results = await yt.search(query, 'song');
    return results.content || [];
  }

  static async getArtist(id) {
    await this.init();
    const artist = await yt.getArtist(id);
    console.log('Artist Name:', artist.name);
    let rawTracks = artist.products?.songs?.content || [];
    if (rawTracks.length === 0 || !rawTracks[0].videoId) {
      console.log('Resolving via search...');
      const searchResults = await this.searchTracks(artist.name);
      console.log('Search results count:', searchResults.length);
    }
  }
}

TestService.getArtist('UCxgN32UVVztKAQd2HkXzBtw');
