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
import { SquareService } from './square.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MulterFile, SquareBody } from 'src/utils/type';

@Controller('square')
export class SquareController {
  constructor(private readonly squareService: SquareService) {}

  @Get('/')
  getSquareList() {
    return this.squareService.getSquareList();
  }

  @Get('/detail')
  getSquareDetail(@Query() query: Record<string, any>) {
    const id = query.id;
    return this.squareService.getSquareDetail({ id });
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'square_thumbnail', maxCount: 1 },
        { name: 'square_link', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() + 1e9);

            callback(
              null,
              `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
            );
          },
        }),
        limits: {
          fileSize: 1024 * 1024 * 30,
        },
      },
    ),
  )
  postSquare(
    @UploadedFiles()
    files: {
      square_thumbnail?: MulterFile[];
      square_link?: MulterFile[];
    },
    @Body() body: SquareBody,
  ) {
    let squareThumbnail = '';
    let squarePdf = '';
    if (files.square_thumbnail) {
      squareThumbnail = `/uploads/${files.square_thumbnail[0].filename}`;
    }

    if (files.square_link) {
      squarePdf = `/uploads/${files.square_link[0].filename}`;
    }

    return this.squareService.postSquare({
      squareThumbnail,
      squarePdf,
      body,
    });
  }

  @Patch('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'square_thumbnail', maxCount: 1 },
        { name: 'square_link', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() + 1e9);

            callback(
              null,
              `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
            );
          },
        }),
        limits: {
          fileSize: 1024 * 1024 * 30, // 30MB
        },
      },
    ),
  )
  patchSquareData(
    @UploadedFiles()
    files: {
      square_thumbnail?: MulterFile[];
      square_link?: MulterFile[];
    },
    @Body() body: SquareBody,
  ) {
    let squareThumbnail = '';
    let squarePdf = '';
    if (files.square_thumbnail) {
      squareThumbnail = `/uploads/${files.square_thumbnail[0].filename}`;
    }

    if (files.square_link) {
      squarePdf = `/uploads/${files.square_link[0].filename}`;
    }

    return this.squareService.patchSquareData({
      squareThumbnail,
      squarePdf,
      body,
    });
  }

  @Delete(':id')
  deleteSquareData(@Param('id', ParseIntPipe) id: number) {
    return this.squareService.deleteSquareData({ id });
  }
}
