import { Controller } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Post } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryResponse } from './cloudinary-respone';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(
        private cloudinaryService: CloudinaryService
    ){}

    @Post('img')
    @UseInterceptors(FilesInterceptor('files',15))
    async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
      const uploadResults = await Promise.all(
        files.map(file => this.cloudinaryService.uploadFile(file))
      );
      return uploadResults;
    }
}
