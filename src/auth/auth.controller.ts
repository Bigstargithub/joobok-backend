import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  getAuth(@Req() req: Request) {
    return this.authService.getAuth({
      request: req,
    });
  }

  @Post('login')
  postLoginAuth(@Body() loginData: AuthLoginDto) {
    return this.authService.postLogin({
      id: loginData.id,
      password: loginData.password,
    });
  }
}
