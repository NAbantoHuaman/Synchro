import { AudioExtractorService } from './src/services/audioExtractor.service';

async function testYtDlp() {
  console.log('Testing yt-dlp Extraction...');
  try {
    const videoId = 'dQw4w9WgXcQ'; // Rick Astley
    const url = await AudioExtractorService.getStreamUrl(videoId);
    console.log('Extracted URL:', url);
    console.log('✅ yt-dlp Test Passed');
  } catch (error) {
    console.error('❌ yt-dlp Test Failed:', error);
  }
}

testYtDlp();
