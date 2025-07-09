import { Module } from '@nestjs/common';
import { SermonController } from './sermon.controller';
import { SermonService } from './sermon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sermon } from 'src/entities/sermon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sermon])],
  controllers: [SermonController],
  providers: [SermonService],
})
export class SermonModule {}
