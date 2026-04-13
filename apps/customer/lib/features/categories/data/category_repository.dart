import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_config.dart';
import '../../../core/models/category.dart';

/// Category state
class CategoryState {
  final List<Category> categories;
  final bool isLoading;
  final String? error;

  const CategoryState({this.categories = const [], this.isLoading = false, this.error});
}

class CategoryNotifier extends StateNotifier<CategoryState> {
  final ApiClient _api = ApiClient();

  CategoryNotifier() : super(const CategoryState(isLoading: true)) {
    loadCategories();
  }

  Future<void> loadCategories() async {
    state = const CategoryState(isLoading: true);
    try {
      final res = await _api.get(ApiConfig.categories);
      final List data = res.data['data'];
      final categories = data.map((c) => Category.fromJson(c)).toList();
      state = CategoryState(categories: categories);
    } catch (e) {
      state = CategoryState(error: 'Failed to load categories. Pull to refresh.');
    }
  }

  Future<Category?> getCategoryBySlug(String slug) async {
    try {
      final res = await _api.get('${ApiConfig.categories}/$slug');
      return Category.fromJson(res.data['data']);
    } catch (_) {
      return null;
    }
  }
}

final categoryProvider = StateNotifierProvider<CategoryNotifier, CategoryState>((ref) => CategoryNotifier());
