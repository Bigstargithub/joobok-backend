import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sermon')
export class Sermon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  thumbnail: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  video_link: string;

  @Column()
  is_deleted: number;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @Column()
  deleted_at: string;
}
