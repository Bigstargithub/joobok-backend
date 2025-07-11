import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Popup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_url: string;

  @Column()
  link: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  updated_at: Date;
}
