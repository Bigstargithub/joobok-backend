import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('main_page')
export class Main {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  main_banner: string;

  @Column()
  youtube_link: string;

  @Column()
  worship_image: string;

  @Column()
  church_image: string;
}
