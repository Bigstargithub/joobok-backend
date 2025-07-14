import { Module } from '@nestjs/common';
import { SquareController } from './square.controller';
import { SquareService } from './square.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Square } from 'src/entities/square.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Square])],
  controllers: [SquareController],
  providers: [SquareService],
})
export class SquareModule {}
