import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Main } from 'src/entities/main.entity';
import { Popup } from 'src/entities/popup.entity';
import { PopupBody } from 'src/utils/type';
import {
  FindOperator,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(Main)
    private mainRepository: Repository<Main>,

    @InjectRepository(Popup)
    private popupRepository: Repository<Popup>,
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

  async getPopupData(isOpen: string) {
    try {
      const restrictObj: {
        id?: number;
        start_date?: FindOperator<Date>;
        end_date?: FindOperator<Date>;
      } = {};
      restrictObj.id = 1;
      if (isOpen === 'Y') {
        restrictObj.start_date = LessThanOrEqual(new Date());
        restrictObj.end_date = MoreThanOrEqual(new Date());
      }

      const popupData = await this.popupRepository.findOne({
        where: restrictObj,
      });
      return { status: 200, popupData };
    } catch (error) {
      console.error(error);
      return { status: 500, message: '팝업이 없습니다.' };
    }
  }

  async postPopup(popupImage: string, body: PopupBody) {
    try {
      const popupData = await this.popupRepository.findOne({
        where: { id: 1 },
      });

      const popupImageURL = popupImage ? popupImage : popupData.image_url;

      await this.popupRepository.upsert(
        {
          id: 1,
          image_url: popupImageURL,
          link: body.popup_link,
          start_date: new Date(body.popup_start_date),
          end_date: new Date(body.popup_end_date),
        },
        { conflictPaths: ['id'] },
      );

      return { status: 200, message: '팝업 업데이트에 성공하였습니다.' };
    } catch (error) {
      console.error(error);
      return { status: 500, message: '팝업 업데이트에 실패하였습니다.' };
    }
  }
}
