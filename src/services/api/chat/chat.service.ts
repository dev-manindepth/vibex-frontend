import { IChatUsers, IMessageBody, IUpdateChatReactionBody } from '@interfaces/index';
import axios from '@services/axios';

class ChatService {
  async getConversationList() {
    const response = await axios.get('/chat/message/conversation-list');
    return response;
  }
  async getChatMessages(receiverId: string) {
    const response = await axios.get(`/chat/message/user/${receiverId}`);
    return response;
  }
  async addChatUsers(body: IChatUsers) {
    const response = await axios.post('/chat/message/add-chat-users', body);
    return response;
  }
  async removeChatUsers(body: IChatUsers) {
    const response = await axios.delete('/chat/message/remove-chat-users', { data: body });
    return response;
  }
  async markMessagesAsRead(senderId: string, receiverId: string) {
    const response = await axios.put(`/chat/message/mark-as-read`, { senderId, receiverId });
    return response;
  }
  async saveChatMessage(body: IMessageBody) {
    const response = await axios.post('/chat/message', body);
    return response;
  }
  async updateMessageReaction(body: IUpdateChatReactionBody) {
    const response = await axios.put('/chat/message/reaction', body);
    return response;
  }
  async markMessageAsDelete(messageId: string, senderId: string, receiverId: string, type: string) {
    const response = await axios.delete(`/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`);
    return response;
  }
}

export const chatService = new ChatService();
