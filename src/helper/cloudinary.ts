import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_ACCESS_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

interface uploadOptions {
  resource_type: 'image' | 'auto' | 'raw' | 'video';
  public_id: string;
}

class CloudinaryService {
  public async uploadImageToCloud(
    buffer: Buffer,
    folder: string,
    options: uploadOptions,
  ) {
    options.public_id = folder + '/' + options.public_id;
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  public async uploadVideoToCloud() {}

  public async removeItemFromCloud() {}
}

export default CloudinaryService;
