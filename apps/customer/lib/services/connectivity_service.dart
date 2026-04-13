import 'dart:async';
import 'dart:io';

/// Connectivity Service — monitors internet connection
///
/// Usage:
///   final isOnline = await ConnectivityService.isConnected();
///   ConnectivityService.onStatusChange.listen((connected) { ... });
///
/// Add to pubspec.yaml: connectivity_plus: ^5.0.2
class ConnectivityService {
  /// Quick check if device has internet
  static Future<bool> isConnected() async {
    try {
      final result = await InternetAddress.lookup('google.com').timeout(const Duration(seconds: 3));
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } on SocketException catch (_) {
      return false;
    } on TimeoutException catch (_) {
      return false;
    }
  }

  /// Wrap an API call with offline handling
  static Future<T> withConnectivityCheck<T>(Future<T> Function() apiCall, {required T Function() offlineFallback}) async {
    final connected = await isConnected();
    if (!connected) return offlineFallback();
    return apiCall();
  }
}
