import { SpotifyService } from './src/services/spotify.service';
import { refreshSpotifyToken } from './src/config/spotify.config';
import dotenv from 'dotenv';

dotenv.config();

async function testSpotify() {
  console.log('Testing Spotify Integration...');
  try {
    await refreshSpotifyToken();
    const tracks = await SpotifyService.searchTracks('Daft Punk');
    console.log('Search Result:', JSON.stringify(tracks[0], null, 2));
    console.log('✅ Spotify Test Passed');
  } catch (error) {
    console.error('❌ Spotify Test Failed:', error);
  }
}

testSpotify();
