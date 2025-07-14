import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('square')
export class Square {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @Column()
  thumbnail: string;

  @Column()
  is_deleted: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  deleted_at: Date;
}
