import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Main } from 'src/entities/main.entity';
import { MainController } from './main.controller';
import { Popup } from 'src/entities/popup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Main, Popup])],
  providers: [MainService],
  controllers: [MainController],
})
export class MainModule {}
