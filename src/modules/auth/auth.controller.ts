import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Credentials } from './types/credentials';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { CurrentUser, CurrentUserId, Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Post('register')
  register(@Body() body: RegisterDTO): Promise<RegisterDTO> {
    return this.authService.register(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Post('login')
  login(@Body() body: LoginDTO): Promise<Credentials> {
    return this.authService.login(body);
  }

  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@CurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  /**
   * Refresh Token using Headers
   */
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ): Promise<Credentials> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
