import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/entities/photo.entity';
import { PhotoFile } from 'src/entities/photofile.entity';
import { MulterFile, PhotoBody } from 'src/utils/type';
import { DataSource, Repository } from 'typeorm';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(PhotoFile)
    private photoFileRepository: Repository<PhotoFile>,
    private dataSource: DataSource,
  ) {}

  async getPhoto() {
    const photoList = await this.photoRepository.find({
      where: { is_deleted: 0 },
      order: { created_at: 'DESC' },
    });

    return { photoList, status: 200 };
  }

  async getPhotoDetail({ id }: { id: number }) {
    const photoData = await this.photoRepository.findOne({
      where: { id, is_deleted: 0 },
    });

    if (!photoData)
      return { message: '우리들의 추억 데이터가 없습니다.', status: 400 };

    const photoFilesList = await this.photoFileRepository.find({
      where: { photo_id: id },
    });

    return {
      photoData,
      photoFilesList,
      status: 200,
    };
  }

  async postPhoto({
    photoThumbnail,
    photoFiles,
    body,
  }: {
    photoThumbnail: string;
    photoFiles: MulterFile[];
    body: PhotoBody;
  }) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const photoData = await queryRunner.manager.create(Photo, {
        title: body.photo_title,
        description: body.photo_description,
        thumbnail: photoThumbnail,
      });

      const savedData = await queryRunner.manager.save(photoData);
      const photoId = savedData.id;

      for (let i = 0; i < photoFiles.length; i++) {
        await queryRunner.manager.insert(PhotoFile, {
          file_path: `/uploads/${photoFiles[i].filename}`,
          photo_id: photoId,
        });
      }

      await queryRunner.commitTransaction();

      return {
        message: '우리들의 추억 데이터 생성에 성공하였습니다.',
        status: 200,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      return {
        message: '우리들의 추억 데이터 생성에 실패하였습니다.',
        status: 500,
      };
    }
  }

  async deletePhotoData({ id }: { id: number }) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const photoData = await this.photoRepository.findOne({
        where: {
          id,
        },
      });

      const photoFileList = await this.photoFileRepository.find({
        where: {
          photo_id: id,
        },
      });

      await queryRunner.manager.delete(Photo, {
        id,
      });

      await queryRunner.manager.delete(PhotoFile, {
        photo_id: id,
      });

      fs.unlink(
        join(process.cwd(), '..', '/photos', photoData.thumbnail),
        (error) => {
          console.error(error);
        },
      );

      for (let i = 0; i < photoFileList.length; i++) {
        fs.unlink(
          join(process.cwd(), '..', '/photos', photoFileList[0].file_path),
          (error) => {
            console.error(error);
          },
        );
      }

      await queryRunner.commitTransaction();

      return {
        message: '우리들의 추억 데이터 삭제에 성공하였습니다.',
        status: 200,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      return {
        message: '우리들의 추억 데이터 삭제에 실패하였습니다.',
        status: 500,
      };
    }
  }

  async patchPhotos({
    photo_thumbnail,
    photo_files,
    body,
  }: {
    photo_thumbnail: string;
    photo_files: MulterFile[];
    body: PhotoBody;
  }) {
    const whereObj: {
      thumbnail?: string;
      title: string;
      description: string;
    } = {
      title: body.photo_title,
      description: body.photo_description,
    };

    if (photo_thumbnail > '') whereObj.thumbnail = photo_thumbnail;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const photoData = await this.photoRepository.findOne({
        where: {
          id: body.photo_id,
        },
      });

      await queryRunner.manager.update(
        Photo,
        {
          id: body.photo_id,
        },
        whereObj,
      );

      const photoFilesList = await this.photoFileRepository.find({
        where: {
          photo_id: body.photo_id,
        },
      });

      if (photo_files && photo_files.length > 0) {
        await queryRunner.manager.delete(PhotoFile, { id: body.photo_id });
        for (let i = 0; i < photo_files.length; i++) {
          const filePath = `/uploads/photos/${photo_files[i].filename}`;
          await queryRunner.manager.insert(PhotoFile, {
            photo_id: body.photo_id,
            file_path: filePath,
          });
        }
      }

      fs.unlink(
        join(process.cwd(), '..', 'photos', photoData.thumbnail),
        (error) => {
          console.error(error);
        },
      );

      if (photo_files && photo_files.length > 0) {
        for (let i = 0; i < photoFilesList.length; i++) {
          fs.unlink(
            join(process.cwd(), '..', 'photos', photoFilesList[i].file_path),
            (error) => {
              console.error(error);
            },
          );
        }
      }

      await queryRunner.commitTransaction();
      return {
        message: '우리들의 추억 데이터 수정에 성공하였습니다.',
        status: 200,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      return {
        message: '우리들의 추억 데이터 수정에 실패하였습니다.',
        status: 500,
      };
    }
  }
}
