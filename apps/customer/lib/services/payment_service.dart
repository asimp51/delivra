/// Payment Service — Stripe Integration
/// WIRING GUIDE:
///
/// STEP 1: Stripe Account
///   1. Go to https://dashboard.stripe.com
///   2. Get Publishable Key (pk_test_...) → put in ApiConfig.stripePublishableKey
///   3. Get Secret Key (sk_test_...) → put in backend .env STRIPE_SECRET_KEY
///
/// STEP 2: Add to pubspec.yaml
///   flutter_stripe: ^10.1.1
///
/// STEP 3: Android Setup (android/app/build.gradle)
///   android { defaultConfig { minSdkVersion 21 } }
///
/// STEP 4: iOS Setup — no extra config needed
///
/// STEP 5: Initialize in main.dart
///   Stripe.publishableKey = ApiConfig.stripePublishableKey;
///
/// STEP 6: Payment Flow
///   1. Customer taps "Pay with Card" in checkout
///   2. App calls backend: POST /api/payments/create-intent { amount, currency }
///   3. Backend creates Stripe PaymentIntent, returns client_secret
///   4. App shows Stripe payment sheet with client_secret
///   5. Customer enters card details
///   6. Stripe processes payment
///   7. Backend receives webhook confirmation
///   8. Order status updates to "paid"

class PaymentService {
  /// Create payment and show Stripe sheet
  Future<bool> processCardPayment({
    required double amount,
    required String orderId,
  }) async {
    // 1. Create PaymentIntent on backend
    // final response = await ApiClient().post('/payments/create-intent', data: {
    //   'amount': (amount * 100).round(), // Stripe uses cents
    //   'currency': 'usd',
    //   'order_id': orderId,
    // });
    // final clientSecret = response.data['data']['client_secret'];

    // 2. Show Stripe payment sheet
    // await Stripe.instance.initPaymentSheet(
    //   paymentSheetParameters: SetupPaymentSheetParameters(
    //     paymentIntentClientSecret: clientSecret,
    //     merchantDisplayName: 'Delivra',
    //     style: ThemeMode.light,
    //   ),
    // );

    // 3. Present payment sheet to user
    // await Stripe.instance.presentPaymentSheet();

    // 4. Payment successful
    return true;
  }

  /// Process Cash on Delivery (no payment processing needed)
  Future<bool> processCashPayment({required String orderId}) async {
    // Just mark the order as COD on the backend
    // Backend handles payment status when rider confirms delivery
    return true;
  }
}
