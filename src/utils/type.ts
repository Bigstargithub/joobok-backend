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

export interface SquareBody {
  square_id?: number;
  square_title: string;
  square_description: string;
}

export interface PhotoBody {
  photo_id?: number;
  photo_title: string;
  photo_description: string;
}
