/// API Configuration — UPDATE THESE VALUES FOR YOUR ENVIRONMENT
///
/// WIRING GUIDE:
/// 1. Development: Use localhost or your local IP
/// 2. Staging: Use your staging server URL
/// 3. Production: Use your production server URL
/// 4. Create .env file and use flutter_dotenv for environment-specific configs
class ApiConfig {
  // ═══════════════════════════════════════════════════
  // CHANGE THIS to your backend URL
  // ═══════════════════════════════════════════════════
  static const String baseUrl = 'http://localhost:3000/api';

  // For Android emulator connecting to localhost:
  // static const String baseUrl = 'http://10.0.2.2:3000/api';

  // For physical device on same WiFi:
  // static const String baseUrl = 'http://192.168.1.XXX:3000/api';

  // Production:
  // static const String baseUrl = 'https://api.delivra.com/api';

  // ═══════════════════════════════════════════════════
  // WebSocket URL for real-time tracking
  // ═══════════════════════════════════════════════════
  static const String wsUrl = 'http://localhost:3000';
  // Production: 'https://api.delivra.com'

  // ═══════════════════════════════════════════════════
  // Google Maps API Key
  // ═══════════════════════════════════════════════════
  static const String googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
  // Get from: https://console.cloud.google.com/apis/credentials
  // Enable: Maps SDK for Android, Maps SDK for iOS, Directions API, Places API

  // ═══════════════════════════════════════════════════
  // Stripe Publishable Key (client-side)
  // ═══════════════════════════════════════════════════
  static const String stripePublishableKey = 'pk_test_YOUR_STRIPE_KEY';
  // Get from: https://dashboard.stripe.com/apikeys

  // ═══════════════════════════════════════════════════
  // Firebase Config (for push notifications)
  // ═══════════════════════════════════════════════════
  // Follow: https://firebase.google.com/docs/flutter/setup
  // 1. Create Firebase project
  // 2. Add Android app (package: com.delivra.customer)
  // 3. Add iOS app (bundle: com.delivra.customer)
  // 4. Download google-services.json -> android/app/
  // 5. Download GoogleService-Info.plist -> ios/Runner/

  // ═══════════════════════════════════════════════════
  // API Endpoints Reference
  // ═══════════════════════════════════════════════════
  static const String authRegister = '/auth/register';
  static const String authLogin = '/auth/login';
  static const String authMe = '/auth/me';
  static const String categories = '/categories';
  static const String vendors = '/vendors';
  static const String orders = '/orders';
  static const String search = '/search';
  static const String uploadImage = '/uploads/image';
  static const String validatePromo = '/payments/validate-promo';
}
