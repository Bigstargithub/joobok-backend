import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainController } from './main/main.controller';
import { MainModule } from './main/main.module';
import { Main } from './entities/main.entity';
import { SermonModule } from './sermon/sermon.module';
import { Sermon } from './entities/sermon.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Main, Sermon],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    MainModule,
    SermonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
