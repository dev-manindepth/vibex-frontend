import { IChatList, IChatUsers, IMessageData } from '@interfaces/index';
import { getConversationList } from '@redux-toolkit/api/chat';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Utils } from '@services/utils/utils.service';

interface IChatState {
  chatList: IMessageData[];
  selectedChatUser: Partial<IMessageData> | null;
  isLoading: boolean;
}
const initialState: IChatState = {
  chatList: [],
  selectedChatUser: null,
  isLoading: false
};
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addToChatList: (state, action: PayloadAction<IChatState>) => {
      const { isLoading, chatList } = action.payload;
      state.chatList = [...chatList];
      state.isLoading = isLoading;
    },
    setSelectedChatUser: (state, action: PayloadAction<{ selectedChatUser: Partial<IMessageData>; isLoading: boolean }>) => {
      const { selectedChatUser, isLoading } = action.payload;
      state.selectedChatUser = selectedChatUser;
      state.isLoading = isLoading;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getConversationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {
      const { list } = action.payload;
      state.isLoading = false;
      const sortedList: IMessageData[] = Utils.orderBy(list, ['createdAt'], ['desc']);
      state.chatList = [...sortedList];
    });
    builder.addCase(getConversationList.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { addToChatList, setSelectedChatUser } = chatSlice.actions;
export default chatSlice.reducer;
