export type MulterFile = Express.Multer.File;

export interface SermonBody {
  sermon_title: string;
  sermon_description: string;
  sermon_video_link: string;
}
