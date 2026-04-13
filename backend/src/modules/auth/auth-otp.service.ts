import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

/**
 * OTP Service — handles email/SMS verification
 *
 * Flow:
 * 1. User registers → system sends 6-digit OTP to email
 * 2. User enters OTP → POST /auth/verify-otp
 * 3. OTP expires in 10 minutes
 * 4. Max 3 attempts before OTP is invalidated
 *
 * For production, integrate:
 * - Email: via EmailProvider (nodemailer/SendGrid)
 * - SMS: via Twilio / MessageBird / AWS SNS
 */

// In-memory OTP store (use Redis in production)
const otpStore = new Map<string, { otp: string; expires: Date; attempts: number }>();

@Injectable()
export class AuthOtpService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async sendOtp(email: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    otpStore.set(email, { otp, expires, attempts: 0 });

    // TODO: Send via EmailProvider or SMS provider
    // await this.emailProvider.sendOTP(email, otp);
    console.log(`[OTP] ${email}: ${otp} (expires: ${expires.toISOString()})`);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(email: string, otp: string): Promise<{ verified: boolean }> {
    const stored = otpStore.get(email);
    if (!stored) throw new BadRequestException('No OTP found. Request a new one.');

    if (new Date() > stored.expires) {
      otpStore.delete(email);
      throw new BadRequestException('OTP expired. Request a new one.');
    }

    if (stored.attempts >= 3) {
      otpStore.delete(email);
      throw new BadRequestException('Too many attempts. Request a new OTP.');
    }

    if (stored.otp !== otp) {
      stored.attempts++;
      throw new BadRequestException(`Invalid OTP. ${3 - stored.attempts} attempts remaining.`);
    }

    otpStore.delete(email);

    // Mark user as verified
    await this.userRepo.update({ email }, { is_verified: true });

    return { verified: true };
  }

  async sendForgotPasswordOtp(email: string): Promise<{ message: string }> {
    return this.sendOtp(email);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    await this.verifyOtp(email, otp);

    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update({ email }, { password_hash: hash });

    return { message: 'Password reset successfully' };
  }
}
