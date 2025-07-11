import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MainService } from './main.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PopupBody } from 'src/utils/type';

type MulterFile = Express.Multer.File;

interface FilesUploadBody {
  main_youtube_link: string;
}

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('/')
  getMainPage() {
    return this.mainService.getMainPage();
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'main_banner_image', maxCount: 1 },
        { name: 'worship_image', maxCount: 1 },
        { name: 'church_image', maxCount: 1 },
      ],
      {
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
      },
    ),
  )
  postMainPage(
    @UploadedFiles()
    files: {
      main_banner_image?: MulterFile[];
      worship_image?: MulterFile[];
      church_image?: MulterFile[];
    },
    @Body() body: FilesUploadBody,
  ) {
    let mainBannerImagePath = '';
    let worshipImagePath = '';
    let churchImagePath = '';
    if (files.main_banner_image) {
      mainBannerImagePath = `/uploads/${files.main_banner_image[0].filename}`;
    }
    if (files.worship_image) {
      worshipImagePath = `/uploads/${files.worship_image[0].filename}`;
    }

    if (files.church_image) {
      churchImagePath = `/uploads/${files.church_image[0].filename}`;
    }

    const youtubeLink = body.main_youtube_link;

    return this.mainService.postMainPage({
      mainBannerImagePath,
      worshipImagePath,
      churchImagePath,
      youtubeLink,
    });
  }

  @Get('/popup')
  getPopupData(@Query() query: Record<string, any>) {
    const isOpen = query.is_open;
    return this.mainService.getPopupData(isOpen);
  }

  @Post('/popup')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'popup_image', maxCount: 1 }], {
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
      fileFilter: (_, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
    }),
  )
  postPopup(
    @UploadedFiles()
    files: {
      popup_image?: MulterFile[];
    },
    @Body() body: PopupBody,
  ) {
    let popupImage = '';
    if (files.popup_image) {
      popupImage = `/uploads/${files.popup_image[0].filename}`;
    }
    return this.mainService.postPopup(popupImage, body);
  }
}
