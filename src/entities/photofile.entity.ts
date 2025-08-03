import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('photo_file')
export class PhotoFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_path: string;

  @Column()
  photo_id: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
