import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sermon } from 'src/entities/sermon.entity';
import { Repository } from 'typeorm';
import { SermonBody } from 'src/utils/type';

@Injectable()
export class SermonService {
  constructor(
    @InjectRepository(Sermon)
    private sermonRepository: Repository<Sermon>,
  ) {}

  async getSermonList() {
    try {
      const sermonList = await this.sermonRepository.find({
        where: { is_deleted: 0 },
      });
      return { status: 200, sermonList };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message: '설교 영상 조회 중 오류가 발생하였습니다.',
      };
    }
  }

  async getSermonData({ id }: { id: string | null }) {
    if (!id) return { status: 400, message: 'id 값이 없습니다.' };

    const sermonData = await this.sermonRepository.findOne({
      where: { id: Number(id), is_deleted: 0 },
    });

    if (!sermonData) return { status: 400, message: '설교 영상이 없습니다.' };

    return { status: 200, sermonData };
  }

  async postSermon({
    sermonThumbnail,
    body,
  }: {
    sermonThumbnail: string;
    body: SermonBody;
  }) {
    try {
      await this.sermonRepository.insert({
        thumbnail: sermonThumbnail,
        title: body.sermon_title,
        description: body.sermon_description,
        video_link: body.sermon_video_link,
      });

      return { status: 200, message: '설교 영상이 정상 등록되었습니다.' };
    } catch (error) {
      console.error(error);
    }
  }

  async patchSermon({
    sermonThumbnail,
    body,
  }: {
    sermonThumbnail: string;
    body: SermonBody;
  }) {
    try {
      const sermonData = await this.sermonRepository.findOne({
        where: { id: body.sermon_id, is_deleted: 0 },
      });

      await this.sermonRepository.update(
        { id: body.sermon_id },
        {
          thumbnail: sermonThumbnail ? sermonThumbnail : sermonData.thumbnail,
          title: body.sermon_title,
          description: body.sermon_description,
          video_link: body.sermon_video_link,
        },
      );

      return { status: 200, message: '설교영상 업데이트에 성공하였습니다.' };
    } catch (error) {
      console.error(error);
      return { status: 500, message: '설교영상 업데이트에 실패하였습니다.' };
    }
  }

  async deleteSermon({ id }: { id: number }) {
    try {
      await this.sermonRepository.update(
        {
          id,
        },
        {
          is_deleted: 1,
          deleted_at: new Date(),
        },
      );

      return { status: 200, message: '설교영상 삭제에 성공하였습니다.' };
    } catch (error) {
      console.error(error);
      return { status: 500, message: '설교영상 삭제에 실패하였습니다.' };
    }
  }
}
