import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signupUser(@Body() userData: CreateUserDto) {
    return this.authService.signupUser(userData);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signinUser(@Body() loginData: SignInUserDto, @Res() res: Response) {
    // 동록된 사용자 확인
    const verifiedUser = await this.authService.verifyUser(loginData);

    // JWT Token 발급(access token)
    const payload = { id: verifiedUser.id, email: verifiedUser.email };
    const accessToken = await this.authService.getAccessToken(payload);

    // Set-Cookie 헤더로 JWT 토큰 & 응답 body로 사용자 정보 반환
    return res.cookie('accessToken', accessToken, { httpOnly: true }).json({
      message: '로그인에 성공하였습니다.',
      data: payload,
    });
  }
}
