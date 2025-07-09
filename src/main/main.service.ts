import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Main } from 'src/entities/main.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(Main)
    private mainRepository: Repository<Main>,
  ) {}

  async getMainPage() {
    const mainData = await this.mainRepository.findOne({ where: { id: 1 } });
    if (!mainData) return {};
    return mainData;
  }

  async postMainPage({
    mainBannerImagePath,
    worshipImagePath,
    churchImagePath,
    youtubeLink,
  }: {
    mainBannerImagePath: string;
    worshipImagePath: string;
    churchImagePath: string;
    youtubeLink: string;
  }): Promise<object | null> {
    const preMainData = await this.mainRepository.findOne({ where: { id: 1 } });
    await this.mainRepository.upsert(
      {
        id: 1,
        main_banner: mainBannerImagePath
          ? mainBannerImagePath
          : preMainData.main_banner,
        worship_image: worshipImagePath
          ? worshipImagePath
          : preMainData.worship_image,
        church_image: churchImagePath
          ? churchImagePath
          : preMainData.church_image,
        youtube_link: youtubeLink,
      },
      {
        conflictPaths: ['id'],
      },
    );

    return { status: 200, message: '정상적으로 저장되었습니다.' };
  }
}
