import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Multer } from 'multer';

@Injectable()
export class CloudinaryService {
  // async uploadImage(
  //   // file: Multer.File,
  //   u_preset = 'zo-foundation',
  // ): Promise<string> {
  //   if (!file || !file.buffer) {
  //     throw new Error('No file buffer found');
  //   }
  //   const public_id = `IMG_${Date.now()}`;
  //   const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  //   try {
  //     const uploadResponse: UploadApiResponse =
  //       await cloudinary.uploader.upload(base64Image, {
  //         upload_preset: u_preset,
  //         resource_type: 'image',
  //         public_id,
  //       });

  //     return uploadResponse.secure_url;
  //   } catch (error) {
  //     console.error('Error uploading image to Cloudinary:', error);
  //     throw new Error('Failed to upload image. Please try again later.');
  //   }
  // }

  async deleteImage(imgUrl: string, u_preset = 'zo-foundation'): Promise<void> {
    if (!imgUrl) return;

    const parts = imgUrl.split('/');
    const fileName = parts?.[parts.length - 1]?.split('.')[0];
    const old_public_id = `${u_preset}/${fileName}`;

    try {
      await cloudinary.uploader.destroy(old_public_id, {
        invalidate: true,
        resource_type: 'image',
      });
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }
}
