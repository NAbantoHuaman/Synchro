const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

async function testManual() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  try {
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token', 
      qs.stringify({ grant_type: 'client_credentials' }),
      { headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    const token = tokenRes.data.access_token;
    console.log('Token obtained manually:', token.substring(0, 10) + '...');
    
    const searchRes = await axios.get('https://api.spotify.com/v1/search', {
      params: { q: 'Daft Punk', type: 'track', limit: 1 },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Search Result:', JSON.stringify(searchRes.data.tracks.items[0].name));
    console.log('✅ Manual Test Passed');
  } catch (error) {
    if (error.response) {
      console.error('❌ Manual Test Failed:', error.response.status, error.response.data);
    } else {
      console.error('❌ Manual Test Failed:', error.message);
    }
  }
}

testManual();
