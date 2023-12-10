import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_ACCESS_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

class CloudinaryService {

    public async uploadImageToCloud() {}

    public async uploadVideoToCloud() {}

    public async removeItemFromCloud() {}

}

export default CloudinaryService;