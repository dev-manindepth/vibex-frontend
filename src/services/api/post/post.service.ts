import { ICommentData, IPostFormData, IReactionData, IReactions } from '@interfaces/index';
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
  async updatePostWithImage(postId: string, body: any) {
    const response = await axios.put(`/post/image/post/${postId}`, body);
    return response;
  }
  async updatePost(postId: string, body: IPostFormData) {
    const response = await axios.put(`/post/${postId}`, body);
    return response;
  }
  async deletePost(postId: string) {
    const respone = await axios.delete(`/post/${postId}`);
    return respone;
  }
  async getAllPosts(page: number) {
    const respone = await axios.get(`/post/all/${page}`);
    return respone;
  }
  async getReactionsByUsername(username: string) {
    const response = await axios.get(`/post/reactions/username/${username}`);
    return response;
  }
  async getPostReactions(postId: string) {
    const response = await axios.get(`/post/reaction/${postId}`);
    return response;
  }
  async getSinglePostReactionByUsername(postId: string, username: string) {
    const response = await axios.get(`/post/single/reaction/username/${username}/${postId}`);
    return response;
  }
  async addReaction(body: IReactionData) {
    const response = await axios.post('/post/reaction', body);
    return response;
  }
  async removeReaction(postId: string, previousReaction: string, postReaction: IReactions) {
    const respone = await axios.delete(`/post/reaction/${postId}/${previousReaction}/${JSON.stringify(postReaction)}`);
    return respone;
  }

  async addComment(body: { userTo: string; postId: string; profilePicture: string | undefined; comment: string }) {
    const response = await axios.post('/post/comment', body);
    return response;
  }
  async getPostCommentsNames(postId: string) {
    const response = await axios.get(`/post/commentnames/${postId}`);
    return response;
  }
  async getPostComments(postId: string) {
    const response = await axios.get(`/post/comment/${postId}`);
    return response;
  }
  async getPostWithImages(page: number) {
    const response = await axios.get(`/post/images/${page}`);
    return response;
  }
}
export const postService = new PostService();
