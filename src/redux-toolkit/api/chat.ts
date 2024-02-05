import { IMessageData } from '@interfaces/index';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { chatService } from '@services/api/chat/chat.service';
import { Utils } from '@services/utils/utils.service';

export const getConversationList = createAsyncThunk<any, void, AsyncThunkConfig>('chat/getUserChatList', async (name, { dispatch }) => {
  try {
    const response = await chatService.getConversationList();
    return response.data;
  } catch (error: any) {
    Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
  }
});
