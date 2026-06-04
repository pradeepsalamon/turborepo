import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import * as Express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = process.env.COOKIE_SECURE === 'true' || isProduction;
  const sameSite = secure ? 'none' : 'lax';
  const domain = process.env.COOKIE_DOMAIN;

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 3600000 * 24,
    path: '/',
    ...(domain ? { domain } : {}),
  } as const;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Express.Response,
  ) {
    const { token, user } = await this.authService.login(dto);
    response.cookie('access_token', token, getCookieOptions());

    return {
      message: 'Logged in successfully',
      user,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Express.Response) {
    response.clearCookie('access_token', getCookieOptions());

    return {
      message: 'Logged out successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return req.user;
  }
}
