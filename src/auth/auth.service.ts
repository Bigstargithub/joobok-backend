import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getAuth({ request }: { request: Request }) {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    if (type !== 'Bearer') return { status: 401, message: null };

    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('PASSWORD_SECRET_KEY'),
    });

    if (payload['jesus'] === this.configService.get('VERIFY_TEXT'))
      return {
        status: 200,
        message: 'ok',
      };

    return { status: 401, message: null };
  }

  async postLogin({
    id,
    password,
  }: {
    id: string;
    password: string;
  }): Promise<object | null> {
    if (
      id !== this.configService.get('ADMIN_ID') ||
      password != this.configService.get('ADMIN_PASSWORD')
    ) {
      return { status: 401, accessToken: null };
    }

    const accessToken = await this.jwtService.signAsync({
      jesus: this.configService.get('VERIFY_TEXT'),
    });

    return {
      status: 200,
      accessToken,
    };
  }
}
