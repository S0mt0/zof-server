import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const allowedFileTypes = ['image/jpg', 'image/png', 'image/jpeg'];
    const maxFileSize = 2000000; // 2MB

    if (!allowedFileTypes.includes(value.mimetype)) return false;

    if (value.size > maxFileSize) return false;

    return true;
  }
}
