import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MulterFile, PhotoBody } from 'src/utils/type';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get('/')
  getPhotos() {
    return this.photoService.getPhoto();
  }

  @Get(':id')
  getPhotoDetail(@Param('id', ParseIntPipe) id: number) {
    return this.photoService.getPhotoDetail({ id });
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo_thumbnail', maxCount: 1 },
        { name: 'photo_files', maxCount: 100 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/photos',
          filename: (_, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() + 1e9);

            callback(
              null,
              `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, callback) => {
          if (
            !file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
          ) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: 1024 * 1024 * 10, // 10MB
        },
      },
    ),
  )
  postPhoto(
    @UploadedFiles()
    files: {
      photo_thumbnail?: MulterFile[];
      photo_files?: MulterFile[];
    },
    @Body() body: PhotoBody,
  ) {
    let photoThumbnail = '';
    if (files.photo_thumbnail) {
      photoThumbnail = `/uploads/${files.photo_thumbnail[0].filename}`;
    }
    return this.photoService.postPhoto({
      photoThumbnail,
      photoFiles: files.photo_files,
      body,
    });
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo_thumbnail', maxCount: 1 },
        { name: 'photo_files', maxCount: 100 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/photos',
          filename: (_, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() + 1e9);

            callback(
              null,
              `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: 1024 * 1024 * 10,
        },
      },
    ),
  )
  patchPhotos(
    @UploadedFiles()
    files: {
      photo_thumbnail?: MulterFile[];
      photo_files?: MulterFile[];
    },
    @Body() body: PhotoBody,
  ) {
    let photoThumbnail = '';
    if (files.photo_thumbnail) {
      photoThumbnail = `/uploads/photos/${files.photo_thumbnail[0].filename}`;
    }

    return this.photoService.patchPhotos({
      photo_thumbnail: photoThumbnail,
      photo_files: files.photo_files,
      body,
    });
  }

  @Delete(':id')
  deletePhotoData(@Param('id', ParseIntPipe) id: number) {
    return this.photoService.deletePhotoData({ id });
  }
}
