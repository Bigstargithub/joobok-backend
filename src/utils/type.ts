export type MulterFile = Express.Multer.File;

export interface SermonBody {
  sermon_id?: number;
  sermon_title: string;
  sermon_description: string;
  sermon_video_link: string;
}

export interface PopupBody {
  popup_link: string;
  popup_start_date: string;
  popup_end_date: string;
}
