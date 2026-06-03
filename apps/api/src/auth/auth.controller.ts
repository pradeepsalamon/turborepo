import { Controller, Post, Body, Get, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import * as Express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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

    // Set cookie
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
      sameSite: 'lax',
      maxAge: 3600000 * 24, // 24 hours
      path: '/',
    });

    return {
      message: 'Logged in successfully',
      user,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Express.Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

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
