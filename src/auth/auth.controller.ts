import { Controller, Post, Body, Delete, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Auth } from './decorators/auth.decorator';
import { IWebResponse } from '../common/interfaces/web.interface';
import { IAuth, ILogin } from './interfaces/auth.interface';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IWebResponse<ILogin>> {
    const result = await this.authService.login(payload);
    response.cookie('refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });
    return {
      status: StatusResponse.SUCCESS,
      data: {
        accessToken: result.accessToken,
      },
    };
  }

  @Post('refresh-token')
  async updateAccessToken(
    @Req() request: Request,
  ): Promise<IWebResponse<ILogin>> {
    const result = await this.authService.updateAccessToken(
      request.cookies?.refresh_token,
    );
    return {
      status: StatusResponse.SUCCESS,
      message: 'Access Token Berhasil Dibuat',
      data: {
        accessToken: result,
      },
    };
  }

  @Auth()
  @Delete()
  async logout(
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IWebResponse<boolean>> {
    const auth: IAuth = request.user;
    await this.authService.logout(auth);
    response.cookie('refresh_token', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
      sameSite: 'none',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
    });
    return {
      status: StatusResponse.SUCCESS,
      message: 'Logout Berhasil',
      data: true,
    };
  }
}
