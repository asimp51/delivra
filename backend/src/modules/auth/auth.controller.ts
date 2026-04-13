import { Controller, Post, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthOtpService } from './auth-otp.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthRateLimitGuard } from '../../common/guards/rate-limit.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: AuthOtpService,
  ) {}

  @Post('register')
  @UseGuards(AuthRateLimitGuard)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(AuthRateLimitGuard)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProfile(@CurrentUser() user: User, @Body() data: Partial<User>) {
    return this.authService.updateProfile(user.id, data);
  }

  @Post('send-otp')
  @UseGuards(AuthRateLimitGuard)
  sendOtp(@Body('email') email: string) {
    return this.otpService.sendOtp(email);
  }

  @Post('verify-otp')
  @UseGuards(AuthRateLimitGuard)
  verifyOtp(@Body() data: { email: string; otp: string }) {
    return this.otpService.verifyOtp(data.email, data.otp);
  }

  @Post('forgot-password')
  @UseGuards(AuthRateLimitGuard)
  forgotPassword(@Body('email') email: string) {
    return this.otpService.sendForgotPasswordOtp(email);
  }

  @Post('reset-password')
  @UseGuards(AuthRateLimitGuard)
  resetPassword(@Body() data: { email: string; otp: string; new_password: string }) {
    return this.otpService.resetPassword(data.email, data.otp, data.new_password);
  }
}
