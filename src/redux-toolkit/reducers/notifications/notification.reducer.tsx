import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import checkIcon from '@assets/images/check.svg';
import errorIcon from '@assets/images/error.svg';
import infoIcon from '@assets/images/info.svg';
import warningIcon from '@assets/images/warning.svg';
import { INotificationData, IToastData, ToastIcons } from '@interfaces/index';

const initialState: IToastData[] = [];
let list: IToastData[] = [];

const toastIcons = [
  { success: { icon: checkIcon, color: '#5cb85c' } },
  { error: { icon: errorIcon, color: '#d9534f' } },
  { info: { icon: infoIcon, color: '#5bc0de' } },
  { warning: { icon: warningIcon, color: '#f0ad4e' } }
];

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotifications: (state, action: PayloadAction<INotificationData>) => {
      const { message, type } = action.payload;
      const toast = (toastIcons.find((toastIcon) => toastIcon[type]) as unknown as ToastIcons) || {};
      const toastItem = {
        id: state.length,
        description: message,
        type,
        icon: toast[type].icon,
        backgroundColor: toast[type].color
      };
      list = JSON.parse(JSON.stringify(list));
      list.unshift(toastItem);
      list = list
        .filter((item, index, self) => self.findIndex((t) => t.description === item.description) === index)
        .map((item) => ({ ...item }));
      return list;
    },
    clearNotification: () => {
      list = [];
      return [];
    }
  }
});

export default notificationSlice.reducer;
export const { addNotifications, clearNotification } = notificationSlice.actions;
