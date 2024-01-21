import { IFeelingData } from '@interfaces/index';
import { createSlice } from '@reduxjs/toolkit';

interface IModalInitialState {
  type: 'add' | 'edit' | '';
  isOpen: boolean;
  feeling: IFeelingData;
  image: string;
  data?: any;
  feelingIsOpen: boolean;
  openFileDialog: boolean;
  gifModalIsOpen: boolean;
  reactionModalIsOpen: boolean;
  commentModalIsOpen: boolean;
  deleteDialogIsOpen: boolean;
}
const initialState: IModalInitialState = {
  type: '',
  isOpen: false,
  feeling: {},
  image: '',
  data: null,
  feelingIsOpen: false,
  openFileDialog: false,
  gifModalIsOpen: false,
  reactionModalIsOpen: false,
  commentModalIsOpen: false,
  deleteDialogIsOpen: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { type, data } = action.payload;
      state.isOpen = true;
      state.type = type;
      state.data = data;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = '';
      state.feeling = {};
      state.image = '';
      state.data = null;
      state.feelingIsOpen = false;
      state.gifModalIsOpen = false;
      state.reactionModalIsOpen = false;
      state.commentModalIsOpen = false;
      state.openFileDialog = false;
      state.deleteDialogIsOpen = false;
    },
    addPostFeeling: (state, action) => {
      const { feeling } = action.payload;
      state.feeling = feeling;
    },
    toggleImageModal: (state, action) => {
      state.openFileDialog = action.payload;
    },
    toggleFeelingModal: (state, action) => {
      state.feelingIsOpen = action.payload;
    },
    toggleGifModal: (state, action) => {
      state.gifModalIsOpen = action.payload;
    },
    toggleReactionsModal: (state, action) => {
      state.reactionModalIsOpen = action.payload;
    },
    toggleCommentsModal: (state, action) => {
      state.commentModalIsOpen = action.payload;
    },
    toggleDeleteDialog: (state, action) => {
      const { data, toggle } = action.payload;
      state.deleteDialogIsOpen = toggle;
      state.data = data;
    }
  }
});

export default modalSlice.reducer;
export const {
  openModal,
  closeModal,
  addPostFeeling,
  toggleCommentsModal,
  toggleDeleteDialog,
  toggleFeelingModal,
  toggleGifModal,
  toggleImageModal,
  toggleReactionsModal
} = modalSlice.actions;
