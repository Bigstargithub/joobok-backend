import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Square } from 'src/entities/square.entity';
import { SquareBody } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class SquareService {
  constructor(
    @InjectRepository(Square)
    private squareRepository: Repository<Square>,
  ) {}

  async getSquareList() {
    try {
      const squareList = await this.squareRepository.find({
        where: { is_deleted: 0 },
        order: { id: 'DESC' },
      });

      return { status: 200, squareList };
    } catch (error) {
      console.error(error);
      return { status: 500, message: '주복광장 조회 중 오류가 발생했습니다.' };
    }
  }

  async getSquareDetail({ id }: { id: string }) {
    if (!id) return { status: 400, message: 'id 값이 없습니다.' };

    const squareData = await this.squareRepository.findOne({
      where: { id: Number(id), is_deleted: 0 },
    });

    if (!squareData)
      return { status: 400, message: '주복광장 데이터가 없습니다.' };

    return { status: 200, squareData };
  }

  async postSquare({
    squareThumbnail,
    squarePdf,
    body,
  }: {
    squareThumbnail: string;
    squarePdf: string;
    body: SquareBody;
  }) {
    try {
      await this.squareRepository.insert({
        thumbnail: squareThumbnail,
        title: body.square_title,
        description: body.square_description,
        link: squarePdf,
      });

      return { status: 200, message: '주복광장 데이터 생성에 성공하였습니다.' };
    } catch (error) {
      console.error(error);
      return { status: 500, message: '주복광장 데이터 생성에 실패하였습니다.' };
    }
  }

  async patchSquareData({
    squareThumbnail,
    squarePdf,
    body,
  }: {
    squareThumbnail: string;
    squarePdf: string;
    body: SquareBody;
  }) {
    try {
      if (!body.square_id) {
        return { status: 400, message: '고유 id값이 없습니다.' };
      }
      const updateObj: {
        title: string;
        description: string;
        thumbnail?: string;
        link?: string;
      } = {
        title: body.square_title,
        description: body.square_description,
      };

      if (squareThumbnail > '') {
        updateObj.thumbnail = squareThumbnail;
      }

      if (squarePdf > '') {
        updateObj.link = squarePdf;
      }

      await this.squareRepository.update(
        {
          id: body.square_id,
        },
        updateObj,
      );

      return {
        status: 200,
        message: '주복광장 데이터 업데이트에 성공하였습니다.',
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message: '주복광장 데이터 업데이트에 실패하였습니다.',
      };
    }
  }

  async deleteSquareData({ id }: { id: number }) {
    try {
      if (!id) return { status: 400, message: '고유 id값이 없습니다.' };
      console.log('id: ', id);
      await this.squareRepository.update(
        {
          id,
        },
        {
          is_deleted: 1,
          deleted_at: new Date(),
        },
      );

      return { status: 200, message: '주복광장 데이터 삭제에 성공하였습니다.' };
    } catch (error) {
      console.error(error);
      return { status: 500, message: '주복광장 데이터 삭제에 실패하였습니다.' };
    }
  }
}
