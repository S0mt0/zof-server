import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../constants';

const config = new ConfigService();

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: config.get(CLOUDINARY_CLOUD_NAME),
    api_key: config.get(CLOUDINARY_API_KEY),
    api_secret: config.get(CLOUDINARY_API_SECRET),
    secure: true,
  });
};

export { cloudinary };
