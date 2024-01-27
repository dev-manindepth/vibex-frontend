import { createSlice } from '@reduxjs/toolkit';
import { IReactionData } from '@interfaces/index';

interface IReactionState {
  reactions: IReactionData[];
}
const initialState: IReactionState = {
  reactions: []
};

const reactionSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    addReactions: (state, action) => {
      state.reactions = action.payload;
    }
  }
});

export const { addReactions } = reactionSlice.actions;
export default reactionSlice.reducer;
