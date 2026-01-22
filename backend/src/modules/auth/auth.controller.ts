import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto, VerifyPhoneDto, LoginUserDto } from './dto/register-user.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user (rider)' })
  async registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(
      dto.phoneNumber,
      dto.password,
      dto.firstName,
      dto.lastName,
      dto.email,
    );
  }

  @Post('verify/user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user phone number' })
  async verifyPhone(@Body() dto: VerifyPhoneDto) {
    return this.authService.verifyPhone(dto.userId, dto.code);
  }

  @Post('login/user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async loginUser(@Body() dto: LoginUserDto) {
    return this.authService.loginUser(dto.phoneNumber, dto.password);
  }





  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user/driver profile' })
  async getProfile(@CurrentUser() user: any) {
    if (user.type === 'user') {
      return this.authService.validateUser(user.sub);
    }
    // For now, we only support user profiles
    return this.authService.validateUser(user.sub);
  }
}

