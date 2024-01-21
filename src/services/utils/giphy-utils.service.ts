import { giphyService } from '@services/giphy/giphy.service';

export class GiphyUtils {
  static async getTrendingGifs(setGifs: (gif: any[]) => void, setLoading: (loading: boolean) => void) {
    setLoading(true);
    try {
      const response = await giphyService.trending();
      setGifs(response.data.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }
  static async searchGifs(gif: string, setGifs: (gif: any[]) => void, setLoading: (loading: boolean) => void) {
    if (gif.length <= 1) {
      GiphyUtils.getTrendingGifs(setGifs, setLoading);
      return;
    }
    try {
      const response = await giphyService.search(gif);
      setGifs(response.data.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }
}
