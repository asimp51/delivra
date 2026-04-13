import { Controller, Post, Get, Body, Param, UseGuards, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { PaymentsService } from './payments.service';
import { StripeProvider } from './providers/stripe.provider';
import { Request } from 'express';

/**
 * Real Payment Controller — handles Stripe payment flow
 *
 * Flow:
 * 1. Customer creates PaymentIntent → POST /payments/create-intent
 * 2. Flutter shows Stripe payment sheet with client_secret
 * 3. Customer enters card → Stripe charges
 * 4. Stripe sends webhook → POST /payments/webhook
 * 5. Backend updates order payment_status to 'paid'
 */
@ApiTags('Payments')
@Controller('payments')
export class PaymentsRealController {
  constructor(
    private paymentsService: PaymentsService,
    private stripeProvider: StripeProvider,
  ) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPaymentIntent(
    @CurrentUser() user: User,
    @Body() data: { amount: number; order_id: string; currency?: string },
  ) {
    const { clientSecret, paymentIntentId } = await this.stripeProvider.createPaymentIntent(
      data.amount,
      data.currency || 'usd',
      { order_id: data.order_id, customer_id: user.id },
    );

    await this.paymentsService.createPayment(data.order_id, data.amount, 'card');

    return { client_secret: clientSecret, payment_intent_id: paymentIntentId };
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.stripeProvider.handleWebhook(req.rawBody, signature);
    return { received: true };
  }
}
