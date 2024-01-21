import axios from '@services/axios';

class PostService {
  async createPost(body: any) {
    const response = axios.post('/post', body);
    return response;
  }
  async createPostWithImage(body: any) {
    const response = await axios.post('/post/image/post', body);
    return response;
  }
  async getAllPosts(page: number) {
    const respone = await axios.get(`/post/all/${page}`);
    return respone;
  }
}
export const postService = new PostService();
