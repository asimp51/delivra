import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Rider API Service — all backend calls for rider app
/// WIRING GUIDE:
/// 1. Update _baseUrl with your deployed backend URL
/// 2. Token auto-attached after rider login
/// 3. Rider registers with role: 'rider'
class RiderApiService {
  static const String _baseUrl = 'http://localhost:3000/api';
  // Android emulator: 'http://10.0.2.2:3000/api'
  // Production: 'https://api.delivra.com/api'

  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  RiderApiService() {
    _dio = Dio(BaseOptions(baseUrl: _baseUrl, connectTimeout: const Duration(seconds: 10)));
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'rider_token');
        if (token != null) options.headers['Authorization'] = 'Bearer $token';
        handler.next(options);
      },
    ));
  }

  // ═══ AUTH ═══
  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _dio.post('/auth/login', data: {'email': email, 'password': password});
    final data = res.data['data'];
    await _storage.write(key: 'rider_token', value: data['token']['access_token']);
    return data['user'];
  }

  Future<Map<String, dynamic>> register(String email, String password, String name, String phone) async {
    final res = await _dio.post('/auth/register', data: {
      'email': email, 'password': password, 'full_name': name, 'phone': phone, 'role': 'rider',
    });
    final data = res.data['data'];
    await _storage.write(key: 'rider_token', value: data['token']['access_token']);
    return data['user'];
  }

  // ═══ RIDER PROFILE ═══
  Future<Map<String, dynamic>> getProfile() async => (await _dio.get('/rider/me')).data['data'];

  Future<void> registerRider({required String vehicleType, String? licensePlate}) async {
    await _dio.post('/rider/register', data: {'vehicle_type': vehicleType, 'license_plate': licensePlate});
  }

  // ═══ ONLINE STATUS ═══
  Future<void> goOnline() async => await _dio.patch('/rider/online-status', data: {'is_online': true});
  Future<void> goOffline() async => await _dio.patch('/rider/online-status', data: {'is_online': false});

  // ═══ ORDERS ═══
  Future<List<Map<String, dynamic>>> getAvailableOrders() async {
    final res = await _dio.get('/rider/available-orders');
    return List<Map<String, dynamic>>.from(res.data['data']);
  }

  Future<void> acceptOrder(String orderId) async => await _dio.post('/rider/orders/$orderId/accept');
  Future<void> markPickedUp(String orderId) async => await _dio.patch('/rider/orders/$orderId/picked-up');
  Future<void> markDelivered(String orderId) async => await _dio.patch('/rider/orders/$orderId/delivered');

  // ═══ LOCATION ═══
  Future<void> updateLocation(double lat, double lng, {String? orderId}) async {
    await _dio.post('/rider/location', data: {'latitude': lat, 'longitude': lng, 'order_id': orderId});
  }

  // ═══ EARNINGS ═══
  Future<Map<String, dynamic>> getEarnings() async => (await _dio.get('/rider/earnings')).data['data'];
}
