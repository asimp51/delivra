/**
 * Email Provider — Send transactional emails
 * WIRING GUIDE:
 *
 * STEP 1: Configure SMTP in .env:
 *   SMTP_HOST=smtp.gmail.com (or SendGrid, Mailgun, AWS SES)
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASS=your-app-password
 *
 * STEP 2: Install nodemailer:
 *   npm install nodemailer @types/nodemailer
 *
 * STEP 3: Use cases:
 *   - OTP verification email
 *   - Order confirmation email
 *   - Password reset email
 *   - Vendor registration welcome email
 *   - Weekly earnings summary for riders
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailProvider {
  // private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    // this.transporter = nodemailer.createTransport({
    //   host: config.get('SMTP_HOST'),
    //   port: config.get('SMTP_PORT'),
    //   secure: false,
    //   auth: {
    //     user: config.get('SMTP_USER'),
    //     pass: config.get('SMTP_PASS'),
    //   },
    // });
  }

  async sendEmail(to: string, subject: string, html: string) {
    // await this.transporter.sendMail({
    //   from: '"Delivra" <noreply@delivra.com>',
    //   to,
    //   subject,
    //   html,
    // });
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
  }

  async sendOTP(to: string, otp: string) {
    await this.sendEmail(to, 'Delivra - Verification Code', `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">Delivra</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 36px; letter-spacing: 8px; color: #059669;">${otp}</h1>
        <p style="color: #666;">This code expires in 10 minutes.</p>
      </div>
    `);
  }

  async sendOrderConfirmation(to: string, orderNumber: string, total: number) {
    await this.sendEmail(to, `Order ${orderNumber} Confirmed!`, `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">Delivra</h2>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed!</p>
        <p>Total: <strong>$${total.toFixed(2)}</strong></p>
        <p>Track your order in the Delivra app.</p>
      </div>
    `);
  }
}
