import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_config.dart';

/// Central API client for all backend communication.
/// WIRING GUIDE:
/// 1. Update ApiConfig.baseUrl with your deployed backend URL
/// 2. Token is auto-attached from secure storage after login
/// 3. All API calls go through this client for consistent auth + error handling
class ApiClient {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static final ApiClient _instance = ApiClient._();
  factory ApiClient() => _instance;

  ApiClient._() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    // Auth interceptor: auto-attach JWT token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token expired — clear and redirect to login
          await _storage.delete(key: 'access_token');
          // TODO: Navigate to login screen
        }
        handler.next(error);
      },
    ));
  }

  // Convenience methods
  Future<Response> get(String path, {Map<String, dynamic>? params}) =>
      _dio.get(path, queryParameters: params);

  Future<Response> post(String path, {dynamic data}) =>
      _dio.post(path, data: data);

  Future<Response> patch(String path, {dynamic data}) =>
      _dio.patch(path, data: data);

  Future<Response> delete(String path) =>
      _dio.delete(path);

  Future<Response> upload(String path, String filePath, {String field = 'file'}) =>
      _dio.post(path, data: FormData.fromMap({
        field: await MultipartFile.fromFile(filePath),
      }));

  // Token management
  Future<void> saveToken(String token) =>
      _storage.write(key: 'access_token', value: token);

  Future<void> clearToken() =>
      _storage.delete(key: 'access_token');

  Future<String?> getToken() =>
      _storage.read(key: 'access_token');
}
