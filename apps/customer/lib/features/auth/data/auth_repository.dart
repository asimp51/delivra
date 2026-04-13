import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_config.dart';

/// Auth state model
class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? user;

  const AuthState({this.isAuthenticated = false, this.isLoading = false, this.error, this.user});

  AuthState copyWith({bool? isAuthenticated, bool? isLoading, String? error, Map<String, dynamic>? user}) =>
    AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      user: user ?? this.user,
    );
}

/// Auth provider — manages authentication state across the app
class AuthNotifier extends StateNotifier<AuthState> {
  final ApiClient _api = ApiClient();

  AuthNotifier() : super(const AuthState()) {
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final token = await _api.getToken();
    if (token != null) {
      try {
        final res = await _api.get(ApiConfig.authMe);
        state = AuthState(isAuthenticated: true, user: res.data['data']);
      } catch (_) {
        await _api.clearToken();
        state = const AuthState();
      }
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final res = await _api.post(ApiConfig.authLogin, data: {
        'email': email,
        'password': password,
      });
      final data = res.data['data'];
      await _api.saveToken(data['token']['access_token']);
      state = AuthState(isAuthenticated: true, user: data['user']);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: _extractError(e));
      return false;
    }
  }

  Future<bool> register({
    required String email,
    required String password,
    required String fullName,
    String? phone,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final res = await _api.post(ApiConfig.authRegister, data: {
        'email': email,
        'password': password,
        'full_name': fullName,
        'phone': phone,
        'role': 'customer',
      });
      final data = res.data['data'];
      await _api.saveToken(data['token']['access_token']);
      state = AuthState(isAuthenticated: true, user: data['user']);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: _extractError(e));
      return false;
    }
  }

  Future<void> logout() async {
    await _api.clearToken();
    state = const AuthState();
  }

  Future<bool> forgotPassword(String email) async {
    try {
      await _api.post('/auth/forgot-password', data: {'email': email});
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> verifyOtp(String email, String otp) async {
    try {
      await _api.post('/auth/verify-otp', data: {'email': email, 'otp': otp});
      return true;
    } catch (_) {
      return false;
    }
  }

  String _extractError(dynamic e) {
    if (e is Exception) {
      final str = e.toString();
      if (str.contains('Invalid credentials')) return 'Invalid email or password';
      if (str.contains('already registered')) return 'Email already registered';
      if (str.contains('SocketException')) return 'No internet connection';
    }
    return 'Something went wrong. Please try again.';
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) => AuthNotifier());
