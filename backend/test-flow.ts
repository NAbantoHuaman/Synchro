import { YoutubeSearchService } from './src/services/youtubeSearch.service';
import { AudioExtractorService } from './src/services/audioExtractor.service';

async function testFullFlow() {
  console.log('Testing Full YouTube Flow (Metadata + Stream)...');
  try {
    // 1. Buscar
    console.log('Searching for "Daft Punk Get Lucky"...');
    const results = await YoutubeSearchService.searchTracks('Daft Punk Get Lucky');
    const track = results[0];
    console.log('Found Track:', JSON.stringify(track, null, 2));

    // 2. Extraer Stream
    console.log('Extracting Stream for VideoID:', track.id);
    const streamUrl = await AudioExtractorService.getStreamUrl(track.id);
    console.log('Stream URL obtained:', streamUrl.substring(0, 50) + '...');
    
    console.log('✅ Full Flow Test Passed');
  } catch (error) {
    console.error('❌ Full Flow Test Failed:', error);
  }
}

testFullFlow();
