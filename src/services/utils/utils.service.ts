import { avatarColors } from './static.data';

export class Utils {
  static avatarColor() {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  }
  static generateAvatar(text: string, backgroundColor: string, foregroundColor: string = 'white') {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'normal 80px sans-serif';
    context.fillStyle = foregroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }
}
