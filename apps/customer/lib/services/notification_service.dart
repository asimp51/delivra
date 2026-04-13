/// Push Notification Service — Firebase Cloud Messaging
/// WIRING GUIDE:
///
/// STEP 1: Firebase Setup
///   1. Go to https://console.firebase.google.com
///   2. Create project "Delivra"
///   3. Add Android app: package name = com.delivra.customer
///   4. Download google-services.json → apps/customer/android/app/
///   5. Add iOS app: bundle ID = com.delivra.customer
///   6. Download GoogleService-Info.plist → apps/customer/ios/Runner/
///
/// STEP 2: Android Setup (android/app/build.gradle)
///   apply plugin: 'com.google.gms.google-services'
///   dependencies {
///     implementation platform('com.google.firebase:firebase-bom:32.7.0')
///   }
///
/// STEP 3: iOS Setup (ios/Runner/AppDelegate.swift)
///   import Firebase
///   FirebaseApp.configure()
///
/// STEP 4: Add to pubspec.yaml
///   firebase_core: ^2.24.2
///   firebase_messaging: ^14.7.9
///
/// STEP 5: Initialize in main.dart
///   await Firebase.initializeApp();
///   await NotificationService().initialize();
///
/// STEP 6: Backend sends notifications via FCM server key
///   Set FCM_SERVER_KEY in backend .env
///   Backend calls FCM API when order status changes

class NotificationService {
  /// Initialize FCM and request permissions
  Future<void> initialize() async {
    // final messaging = FirebaseMessaging.instance;
    //
    // // Request permission (iOS)
    // await messaging.requestPermission(
    //   alert: true,
    //   badge: true,
    //   sound: true,
    // );
    //
    // // Get FCM token (send to backend for this user)
    // final token = await messaging.getToken();
    // print('FCM Token: $token');
    // // TODO: Send token to backend: POST /api/auth/me { fcm_token: token }
    //
    // // Handle foreground messages
    // FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    //   // Show local notification
    //   _showLocalNotification(message);
    // });
    //
    // // Handle background message tap
    // FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    //   // Navigate to order tracking
    //   final orderId = message.data['order_id'];
    //   if (orderId != null) {
    //     // router.push('/tracking/$orderId');
    //   }
    // });
  }

  // void _showLocalNotification(RemoteMessage message) {
  //   // Use flutter_local_notifications to show notification
  // }
}
