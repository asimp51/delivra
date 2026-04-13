import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Vendor API Service — all backend calls for vendor app
class VendorApiService {
  static const String _baseUrl = 'http://localhost:3000/api';
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  VendorApiService() {
    _dio = Dio(BaseOptions(baseUrl: _baseUrl, connectTimeout: const Duration(seconds: 10)));
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'vendor_token');
        if (token != null) options.headers['Authorization'] = 'Bearer $token';
        handler.next(options);
      },
    ));
  }

  // AUTH
  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _dio.post('/auth/login', data: {'email': email, 'password': password});
    final data = res.data['data'];
    await _storage.write(key: 'vendor_token', value: data['token']['access_token']);
    return data['user'];
  }

  // VENDOR PROFILE
  Future<Map<String, dynamic>> getMyVendor() async => (await _dio.get('/vendor/me')).data['data'];
  Future<void> updateVendor(Map<String, dynamic> data) async => await _dio.patch('/vendor/me', data: data);

  // ORDERS
  Future<List<Map<String, dynamic>>> getOrders({String? status}) async {
    final params = <String, dynamic>{};
    if (status != null) params['status'] = status;
    final res = await _dio.get('/vendor/orders', queryParameters: params);
    return List<Map<String, dynamic>>.from(res.data['data']);
  }

  Future<void> acceptOrder(String id) async => await _dio.patch('/vendor/orders/$id/accept');
  Future<void> rejectOrder(String id, {String? reason}) async => await _dio.patch('/vendor/orders/$id/reject', data: {'reason': reason});
  Future<void> markPreparing(String id) async => await _dio.patch('/vendor/orders/$id/preparing');
  Future<void> markReady(String id) async => await _dio.patch('/vendor/orders/$id/ready');

  // MENU
  Future<void> addItem(Map<String, dynamic> data) async => await _dio.post('/vendor/items', data: data);
  Future<void> updateItem(String id, Map<String, dynamic> data) async => await _dio.patch('/vendor/items/$id', data: data);
  Future<void> deleteItem(String id) async => await _dio.delete('/vendor/items/$id');
  Future<void> toggleItemAvailability(String id, bool available) async => await _dio.patch('/vendor/items/$id', data: {'is_available': available});

  // ANALYTICS
  Future<Map<String, dynamic>> getAnalytics() async => (await _dio.get('/admin/analytics/dashboard')).data['data'];
}
