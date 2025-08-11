import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';
import * as bcrypt from 'bcrypt';
import { AuthToken } from './enums/auth.enum';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IAuth, ILogin } from './interfaces/auth.interface';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private errorService: ErrorService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async login(payload: LoginDto): Promise<ILogin> {
    const user = await this.userRepository.getUserByUsername(payload.username, {
      id: true,
      password: true,
      role: true,
      isActive: true,
    });

    if (!user) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    const { password: userPassword, isActive, ...payloadJwt } = user;

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      userPassword,
    );

    if (!isPasswordValid) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    if (!isActive) {
      this.errorService.badRequest('Pengguna Sedang Ditangguhkan');
    }

    const accessToken = await this.generateAuthToken(
      payloadJwt,
      AuthToken.ACCESS_TOKEN,
    );

    const refreshToken = await this.generateAuthToken(
      { id: payloadJwt.id },
      AuthToken.REFRESH_TOKEN,
    );

    await this.prismaService.refresh_Token.upsert({
      where: {
        userId: user.id,
      },
      update: {
        refreshToken,
      },
      create: {
        userId: user.id,
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
      });
    } catch (e) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    const token = await this.prismaService.refresh_Token.findFirst({
      where: {
        refreshToken,
      },
      select: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!token) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    return this.generateAuthToken(token.user, AuthToken.ACCESS_TOKEN);
  }

  async logout(auth: IAuth): Promise<void> {
    await this.prismaService.refresh_Token.delete({
      where: {
        userId: auth.id,
      },
      select: {
        id: true,
      },
    });
  }

  private async generateAuthToken(
    payload: IAuth,
    type: AuthToken,
  ): Promise<string> {
    const expiresIn: string =
      type === AuthToken.ACCESS_TOKEN
        ? this.configService.get<string>('ACCESS_TOKEN_AGE')
        : '30d';
    const secret: string =
      type === AuthToken.ACCESS_TOKEN
        ? this.configService.get<string>('ACCESS_TOKEN_KEY')
        : this.configService.get<string>('REFRESH_TOKEN_KEY');

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
