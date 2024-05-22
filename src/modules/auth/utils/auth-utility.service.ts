import * as argon from 'argon2';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Credentials } from '../types/credentials';

@Injectable()
export class AuthUtilityService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(REQUEST) private request: any,
  ) {}

  async getToken(
    userId: string,
    email: string,
    role: string,
  ): Promise<Credentials> {
    const [accessToken, refreshToken] = await Promise.all([
      // Access Token
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          role,
        },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '1h',
        },
      ),

      // Refresh Token
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateHashRefreshToken(userId: string, token: string): Promise<void> {
    const hash = await argon.hash(token);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }
}
