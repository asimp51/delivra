/**
 * Stripe Payment Provider
 * WIRING GUIDE:
 *
 * STEP 1: Set in .env:
 *   STRIPE_SECRET_KEY=sk_test_your_key
 *   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
 *
 * STEP 2: Install Stripe SDK:
 *   npm install stripe
 *
 * STEP 3: Create webhook endpoint at https://dashboard.stripe.com/webhooks
 *   URL: https://your-api.com/api/payments/webhook
 *   Events: payment_intent.succeeded, payment_intent.payment_failed
 *
 * STEP 4: Payment Flow:
 *   1. Client calls POST /api/payments/create-intent
 *   2. This provider creates a Stripe PaymentIntent
 *   3. Returns client_secret to Flutter app
 *   4. Flutter shows Stripe payment sheet
 *   5. Stripe sends webhook to backend
 *   6. Backend updates order payment_status to 'paid'
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeProvider {
  // private stripe: Stripe;

  constructor(private config: ConfigService) {
    const secretKey = this.config.get('STRIPE_SECRET_KEY');
    if (secretKey && secretKey !== 'sk_test_your_stripe_key') {
      // this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
    }
  }

  /**
   * Create a PaymentIntent for an order
   * @param amount Amount in dollars (will be converted to cents)
   * @param currency Currency code (default: usd)
   * @param metadata Order metadata
   * @returns client_secret for Flutter Stripe SDK
   */
  async createPaymentIntent(
    amount: number,
    currency = 'usd',
    metadata: Record<string, string> = {},
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    // const intent = await this.stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Convert to cents
    //   currency,
    //   metadata,
    //   automatic_payment_methods: { enabled: true },
    // });
    //
    // return {
    //   clientSecret: intent.client_secret!,
    //   paymentIntentId: intent.id,
    // };

    // Placeholder until Stripe is configured
    return {
      clientSecret: 'pi_placeholder_client_secret',
      paymentIntentId: 'pi_placeholder',
    };
  }

  /**
   * Handle Stripe webhook events
   * Call this from a POST /api/payments/webhook endpoint
   */
  async handleWebhook(payload: Buffer, signature: string) {
    // const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    // const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    //
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntent = event.data.object as Stripe.PaymentIntent;
    //     // Update order payment_status to 'paid'
    //     // Update payment record with provider_ref = paymentIntent.id
    //     break;
    //   case 'payment_intent.payment_failed':
    //     // Update order payment_status to 'failed'
    //     break;
    // }
  }

  /**
   * Refund a payment
   */
  async refund(paymentIntentId: string, amount?: number) {
    // await this.stripe.refunds.create({
    //   payment_intent: paymentIntentId,
    //   amount: amount ? Math.round(amount * 100) : undefined,
    // });
  }
}
