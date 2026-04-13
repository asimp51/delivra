import 'dart:async';
import 'package:geolocator/geolocator.dart';

/// Background Location Service for Rider
/// WIRING GUIDE:
///
/// Android permissions (android/app/src/main/AndroidManifest.xml):
///   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
///   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
///   <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
///   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
///
/// iOS permissions (ios/Runner/Info.plist):
///   <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
///   <string>Delivra Rider needs your location to navigate deliveries</string>
///   <key>UIBackgroundModes</key>
///   <array><string>location</string></array>
///
/// For production, use flutter_background_geolocation for better battery life
class RiderLocationService {
  StreamSubscription<Position>? _subscription;

  Future<Position?> getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return null;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return null;
    }
    if (permission == LocationPermission.deniedForever) return null;

    return Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
  }

  /// Start streaming location updates every 5 seconds / 10 meters
  void startTracking(void Function(Position) onUpdate) {
    _subscription = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10,
      ),
    ).listen(onUpdate);
  }

  void stopTracking() {
    _subscription?.cancel();
    _subscription = null;
  }
}
