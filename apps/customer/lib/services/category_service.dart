import '../core/api/api_client.dart';
import '../core/api/api_config.dart';
import '../core/models/category.dart';

/// Category Service — fetches dynamic categories from backend
/// WIRING GUIDE:
/// 1. Call getCategories() from home_screen.dart to populate the category grid
/// 2. Call getCategoryBySlug() from category_screen.dart to get subcategories
/// 3. Categories are dynamic — admin adds/removes from dashboard, app reflects instantly
class CategoryService {
  final _api = ApiClient();

  /// Get all top-level categories with children (the category tree)
  Future<List<Category>> getCategories() async {
    final response = await _api.get(ApiConfig.categories);
    final List data = response.data['data'];
    return data.map((c) => Category.fromJson(c)).toList();
  }

  /// Get single category by slug with its subcategories
  Future<Category> getCategoryBySlug(String slug) async {
    final response = await _api.get('${ApiConfig.categories}/$slug');
    return Category.fromJson(response.data['data']);
  }
}
