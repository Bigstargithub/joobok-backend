import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SermonService } from './sermon.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterFile } from 'src/utils/type';
import * as path from 'path';
import { SermonBody } from 'src/utils/type';

@Controller('sermon')
export class SermonController {
  constructor(private readonly sermonService: SermonService) {}

  @Get('/')
  getSermonList() {
    return this.sermonService.getSermonList();
  }

  @Get('/detail')
  getSermonData(@Query() query: Record<string, any>) {
    const id = query.id;
    return this.sermonService.getSermonData({ id });
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'sermon_thumbnail', maxCount: 1 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
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
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
  )
  postSermon(
    @UploadedFiles()
    files: {
      sermon_thumbnail?: MulterFile[];
    },
    @Body() body: SermonBody,
  ) {
    let sermonThumbnail = '';
    if (files.sermon_thumbnail) {
      sermonThumbnail = `/uploads/${files.sermon_thumbnail[0].filename}`;
    }

    return this.sermonService.postSermon({
      sermonThumbnail,
      body,
    });
  }

  @Patch('/')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'sermon_thumbnail', maxCount: 1 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
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
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
  )
  patchSermon(
    @UploadedFiles()
    files: {
      sermon_thumbnail?: MulterFile[];
    },
    @Body() body: SermonBody,
  ) {
    let sermonThumbnail = '';
    if (files.sermon_thumbnail) {
      sermonThumbnail = `/uploads/${files.sermon_thumbnail[0].filename}`;
    }

    return this.sermonService.patchSermon({
      sermonThumbnail,
      body,
    });
  }

  @Delete(':id')
  deleteSermon(@Param('id', ParseIntPipe) id: number) {
    return this.sermonService.deleteSermon({ id });
  }
}
