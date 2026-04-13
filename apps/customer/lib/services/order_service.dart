import '../core/api/api_client.dart';
import '../core/api/api_config.dart';

/// Order Service — place orders, get history, track, rate
/// WIRING GUIDE:
/// 1. placeOrder() from checkout_screen.dart
/// 2. getMyOrders() from orders_screen.dart
/// 3. getOrderById() from tracking_screen.dart
/// 4. cancelOrder() from order detail
/// 5. rateOrder() after delivery
class OrderService {
  final _api = ApiClient();

  /// Place a new order
  Future<Map<String, dynamic>> placeOrder({
    required String vendorId,
    required String deliveryAddressId,
    required List<Map<String, dynamic>> items,
    String paymentMethod = 'cash',
    String? specialInstructions,
    String? promoCode,
  }) async {
    final response = await _api.post(ApiConfig.orders, data: {
      'vendor_id': vendorId,
      'delivery_address_id': deliveryAddressId,
      'items': items,
      'payment_method': paymentMethod,
      'special_instructions': specialInstructions,
      'promo_code': promoCode,
    });
    return response.data['data'];
  }

  /// Get customer's order history
  Future<List<Map<String, dynamic>>> getMyOrders() async {
    final response = await _api.get(ApiConfig.orders);
    return List<Map<String, dynamic>>.from(response.data['data']);
  }

  /// Get single order detail
  Future<Map<String, dynamic>> getOrderById(String id) async {
    final response = await _api.get('${ApiConfig.orders}/$id');
    return response.data['data'];
  }

  /// Cancel an order
  Future<void> cancelOrder(String id, {String? reason}) async {
    await _api.patch('${ApiConfig.orders}/$id/cancel', data: {'reason': reason});
  }

  /// Rate a delivered order
  Future<void> rateOrder(String id, {
    required int vendorRating,
    int? riderRating,
    String? comment,
  }) async {
    await _api.post('${ApiConfig.orders}/$id/rate', data: {
      'vendor_rating': vendorRating,
      'rider_rating': riderRating,
      'comment': comment,
    });
  }

  /// Validate promo code
  Future<Map<String, dynamic>> validatePromo(String code, double orderAmount) async {
    final response = await _api.post(ApiConfig.validatePromo, data: {
      'code': code,
      'order_amount': orderAmount,
    });
    return response.data['data'];
  }
}
