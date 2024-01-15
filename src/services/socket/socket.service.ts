import { Socket, io } from 'socket.io-client';

class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io(process.env.REACT_APP_BASE_ENDPOINT!, {
      transports: ['websocket'],
      secure: true
    });
  }
  setupSocketConnection() {
    this.socketConnectionEvents();
  }
  private socketConnectionEvents() {
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('disconnect', (reason) => {
      console.log(`Reason: ${reason}`);
      this.socket.connect();
    });
    this.socket.on('connect_error', (error) => {
      console.log(`Error: ${error}`);
      this.socket.connect();
    });
  }
}

export const socketService = new SocketService();
