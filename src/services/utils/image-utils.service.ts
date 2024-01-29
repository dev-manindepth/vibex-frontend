import { IPostData } from '@interfaces/index';
import { updatePostItem } from '@redux-toolkit/reducers/post/post.reducer';
import { Dispatch } from '@reduxjs/toolkit';

export class ImageUtils {
  static validateFile(file: File) {
    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return file && validFileTypes.indexOf(file.type) > -1;
  }
  static checkFileSize(file: File) {
    let fileError = '';
    const isValid = ImageUtils.validateFile(file);
    if (!isValid) {
      fileError = `File ${file.name} not accepted`;
    }
    if (file.size > 50000000) {
      fileError = 'File is too large.';
    }
    return fileError;
  }
  static checkFile(file: File) {
    if (!ImageUtils.validateFile(file)) {
      return window.alert(`File ${file.name} not accepted`);
    }
    if (ImageUtils.checkFileSize(file)) {
      return window.alert(ImageUtils.checkFileSize(file));
    }
  }
  static addFileToReduxStore(
    event: React.ChangeEvent<HTMLInputElement>,
    post: IPostData,
    setSelectedPostImage: (file: File) => void,
    dispatch: Dispatch
  ) {
    const file = event.target.files && event.target.files[0];
    ImageUtils.checkFile(file!);
    setSelectedPostImage(file!);
    dispatch(updatePostItem({ image: URL.createObjectURL(file!), gifUrl: '', imgId: '', imgVersion: '' }));
  }
  static readAsBase64(file: File) {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', (event) => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }

  static getBackgroundColor(imageUrl: string) {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    const backgroundImageColor = new Promise((resolve, reject) => {
      image.addEventListener('load', () => {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const params = imageData.data;
        const bgColor = ImageUtils.convertRGBToHex(params[0], params[1], params[2]);
        resolve(bgColor);
      });
      image.src = imageUrl;
    });
    return backgroundImageColor;
  }
  static convertRGBToHex(red: number, green: number, blue: number) {
    red = Math.min(255, Math.max(0, red));
    green = Math.min(255, Math.max(0, green));
    blue = Math.min(255, Math.max(0, blue));

    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');

    const hexColor = `#${redHex}${greenHex}${blueHex}`;

    return hexColor.toUpperCase();
  }
}
