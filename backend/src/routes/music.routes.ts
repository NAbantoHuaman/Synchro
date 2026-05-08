import { Router } from 'express';
import { MusicController } from '../controllers/music.controller';

const router = Router();

router.get('/search', MusicController.search);
router.get('/suggestions', MusicController.getSuggestions);
router.get('/home', MusicController.getHome);
router.get('/artist/:id', MusicController.getArtist);
router.get('/album/:id', MusicController.getAlbum);
router.get('/playlist-details/:id', MusicController.getPlaylist);
router.get('/track/:id', MusicController.getTrackAndStream);
router.get('/lyrics/:id', MusicController.getLyrics);
router.get('/related/:id', MusicController.getRelated);
router.get('/daily-mix', MusicController.getDailyMix);
router.get('/recommendations', MusicController.getRecommendations);

export default router;
