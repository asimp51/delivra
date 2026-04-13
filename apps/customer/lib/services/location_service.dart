import 'package:geolocator/geolocator.dart';

/// Location Service — gets user's GPS coordinates
/// WIRING GUIDE:
/// 1. Call getCurrentLocation() on app startup to get user position
/// 2. Pass lat/lng to VendorService.getNearbyVendors() for proximity sort
/// 3. Add permissions to AndroidManifest.xml and Info.plist:
///
///    Android (android/app/src/main/AndroidManifest.xml):
///    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
///    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
///
///    iOS (ios/Runner/Info.plist):
///    <key>NSLocationWhenInUseUsageDescription</key>
///    <string>Delivra needs your location to find nearby vendors</string>
///    <key>NSLocationAlwaysUsageDescription</key>
///    <string>Delivra needs your location for delivery tracking</string>
class LocationService {
  /// Get current user position
  Future<Position?> getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return null;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return null;
    }
    if (permission == LocationPermission.deniedForever) return null;

    return Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }

  /// Stream location updates (for rider tracking)
  Stream<Position> getLocationStream() {
    return Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // Update every 10 meters
      ),
    );
  }
}
