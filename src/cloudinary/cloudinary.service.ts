import { Injectable, BadRequestException } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(uploadStream);
    });
  }

  async removeImage(
    publicId: string,
  ): Promise<{ result: string } | UploadApiErrorResponse> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async removeImageByUrl(
    url: string,
  ): Promise<{ result: string } | UploadApiErrorResponse> {
    const publicId = this.extractPublicIdFromUrl(url);
    if (!publicId) {
      throw new BadRequestException('Invalid URL');
    }
    return this.removeImage(publicId);
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const urlPattern = /\/upload\/(?:v\d+\/)?([^\.]+)\.[a-zA-Z]+$/;
    const match = url.match(urlPattern);
    return match ? match[1] : null;
  }
}
