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
}
