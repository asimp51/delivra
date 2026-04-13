import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_config.dart';

class OrdersState {
  final List<Map<String, dynamic>> orders;
  final bool isLoading;
  final String? error;

  const OrdersState({this.orders = const [], this.isLoading = false, this.error});
}

class OrdersNotifier extends StateNotifier<OrdersState> {
  final ApiClient _api = ApiClient();

  OrdersNotifier() : super(const OrdersState());

  Future<void> loadOrders() async {
    state = const OrdersState(isLoading: true);
    try {
      final res = await _api.get(ApiConfig.orders);
      state = OrdersState(orders: List<Map<String, dynamic>>.from(res.data['data']));
    } catch (e) {
      state = const OrdersState(error: 'Failed to load orders');
    }
  }

  Future<Map<String, dynamic>?> placeOrder({
    required String vendorId,
    required String addressId,
    required List<Map<String, dynamic>> items,
    String paymentMethod = 'cash',
    String? instructions,
    String? promoCode,
  }) async {
    try {
      final res = await _api.post(ApiConfig.orders, data: {
        'vendor_id': vendorId,
        'delivery_address_id': addressId,
        'items': items,
        'payment_method': paymentMethod,
        'special_instructions': instructions,
        'promo_code': promoCode,
      });
      await loadOrders();
      return res.data['data'];
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, dynamic>?> getOrder(String id) async {
    try {
      final res = await _api.get('${ApiConfig.orders}/$id');
      return res.data['data'];
    } catch (_) {
      return null;
    }
  }

  Future<bool> cancelOrder(String id, {String? reason}) async {
    try {
      await _api.patch('${ApiConfig.orders}/$id/cancel', data: {'reason': reason});
      await loadOrders();
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> rateOrder(String id, {required int vendorRating, int? riderRating, String? comment}) async {
    try {
      await _api.post('${ApiConfig.orders}/$id/rate', data: {
        'vendor_rating': vendorRating,
        'rider_rating': riderRating,
        'comment': comment,
      });
      return true;
    } catch (_) {
      return false;
    }
  }
}

final ordersProvider = StateNotifierProvider<OrdersNotifier, OrdersState>((ref) => OrdersNotifier());
