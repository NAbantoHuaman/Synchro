import { YoutubeSearchService } from './src/services/youtubeSearch.service';

async function testYoutube() {
  console.log('Testing YouTube Music Search...');
  try {
    const videoId = await YoutubeSearchService.findBestMatch('Get Lucky', 'Daft Punk');
    console.log('Found Video ID:', videoId);
    console.log('✅ YouTube Test Passed');
  } catch (error) {
    console.error('❌ YouTube Test Failed:', error);
  }
}

testYoutube();
