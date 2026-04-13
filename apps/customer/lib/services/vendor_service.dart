import '../core/api/api_client.dart';
import '../core/api/api_config.dart';
import '../core/models/vendor.dart';

/// Vendor Service — fetches vendors and their menus
/// WIRING GUIDE:
/// 1. Call getNearbyVendors() from home_screen.dart "Popular Near You"
/// 2. Call getVendorBySlug() from vendor_detail_screen.dart for menu
/// 3. Pass user's lat/lng from geolocator for nearby sorting
class VendorService {
  final _api = ApiClient();

  /// Get vendors near user, optionally filtered by category
  Future<List<Vendor>> getNearbyVendors({
    String? categorySlug,
    double? latitude,
    double? longitude,
  }) async {
    final params = <String, dynamic>{};
    if (categorySlug != null) params['category'] = categorySlug;
    if (latitude != null) params['lat'] = latitude;
    if (longitude != null) params['lng'] = longitude;

    final response = await _api.get(ApiConfig.vendors, params: params);
    final List data = response.data['data'];
    return data.map((v) => Vendor.fromJson(v)).toList();
  }

  /// Get vendor detail with full menu
  Future<Vendor> getVendorBySlug(String slug) async {
    final response = await _api.get('${ApiConfig.vendors}/$slug');
    return Vendor.fromJson(response.data['data']);
  }
}
