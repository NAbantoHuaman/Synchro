import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Función para refrescar el token de acceso (Client Credentials Flow)
export const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('Spotify Token Refreshed. Expires in:', data.body['expires_in']);
    spotifyApi.setAccessToken(data.body['access_token']);
    
    // Programar el próximo refresco un minuto antes de que expire
    setTimeout(refreshSpotifyToken, (data.body['expires_in'] - 60) * 1000);
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    // Reintentar en 5 segundos si falla
    setTimeout(refreshSpotifyToken, 5000);
  }
};

export default spotifyApi;
