import '../core/api/api_client.dart';
import '../core/api/api_config.dart';

/// Authentication Service
/// WIRING GUIDE:
/// 1. This connects to POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
/// 2. Token is saved in FlutterSecureStorage via ApiClient
/// 3. Call AuthService.login() from login_screen.dart
/// 4. Call AuthService.register() from register_screen.dart
/// 5. Call AuthService.getProfile() on app startup to check if logged in
class AuthService {
  final _api = ApiClient();

  /// Register a new customer account
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String fullName,
    String? phone,
  }) async {
    final response = await _api.post(ApiConfig.authRegister, data: {
      'email': email,
      'password': password,
      'full_name': fullName,
      'phone': phone,
      'role': 'customer',
    });

    final data = response.data['data'];
    await _api.saveToken(data['token']['access_token']);
    return data['user'];
  }

  /// Login with email and password
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _api.post(ApiConfig.authLogin, data: {
      'email': email,
      'password': password,
    });

    final data = response.data['data'];
    await _api.saveToken(data['token']['access_token']);
    return data['user'];
  }

  /// Get current user profile
  Future<Map<String, dynamic>> getProfile() async {
    final response = await _api.get(ApiConfig.authMe);
    return response.data['data'];
  }

  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await _api.getToken();
    return token != null;
  }

  /// Logout
  Future<void> logout() async {
    await _api.clearToken();
  }
}
