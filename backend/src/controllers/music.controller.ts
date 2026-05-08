import { Request, Response } from 'express';
import { YoutubeSearchService } from '../services/youtubeSearch.service';
import { AudioExtractorService } from '../services/audioExtractor.service';

export class MusicController {
  static async search(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });

    try {
      const results = await YoutubeSearchService.searchAll(q as string);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getArtist(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const results = await YoutubeSearchService.getArtist(id as string);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getHome(req: Request, res: Response) {
    try {
      const results = await YoutubeSearchService.getHomeContent();
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTrackAndStream(req: Request, res: Response) {
    const { id } = req.params; // Aquí el 'id' será el videoId de YouTube

    try {
      // Fase 1: Metadatos de YouTube Music
      const track = await YoutubeSearchService.getTrackById(id as string);

      // Fase 2: Ya tenemos el ID, vamos directo a la extracción
      const streamInfo = await AudioExtractorService.getStreamUrl(id as string);

      res.json({
        ...track,
        videoId: id,
        streamUrl: streamInfo.url,
        bitrate: streamInfo.bitrate,
        format: streamInfo.format
      });
    } catch (error: any) {
      console.error('Flow Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getStreamOnly(req: Request, res: Response) {
    const { videoId } = req.params;
    try {
      const streamInfo = await AudioExtractorService.getStreamUrl(videoId as string);
      res.json({ streamUrl: streamInfo.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLyrics(req: Request, res: Response) {
    const { id } = req.params;
    const { track, artist } = req.query;
    try {
      const results = await YoutubeSearchService.getLyrics(id as string, track as string, artist as string);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRelated(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const results = await YoutubeSearchService.getRelatedTracks(id as string);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSuggestions(req: Request, res: Response) {
    const { q } = req.query;
    try {
      const results = await YoutubeSearchService.getSuggestions(q as string);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAlbum(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const results = await YoutubeSearchService.getAlbum(id as string);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPlaylist(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const results = await YoutubeSearchService.getPlaylist(id as string);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDailyMix(req: Request, res: Response) {
    const { artists } = req.query;
    try {
      const artistList = artists ? (artists as string).split(',') : [];
      const results = await YoutubeSearchService.getDailyMix(artistList);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRecommendations(req: Request, res: Response) {
    const { tracks } = req.query;
    try {
      const trackList = tracks ? (tracks as string).split(',') : [];
      const results = await YoutubeSearchService.getRecommendations(trackList);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async testCookies(req: Request, res: Response) {
    try {
      const result = await AudioExtractorService.testCookies();
      res.header('Content-Type', 'text/plain').send(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
