import { Module } from '@nestjs/common';
import { SermonController } from './sermon.controller';
import { SermonService } from './sermon.service';

@Module({
  controllers: [SermonController],
  providers: [SermonService]
})
export class SermonModule {}
