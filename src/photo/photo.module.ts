import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/entities/photo.entity';
import { PhotoFile } from 'src/entities/photofile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, PhotoFile])],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
