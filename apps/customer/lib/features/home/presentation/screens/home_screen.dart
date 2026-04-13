import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';
import '../../../../core/widgets/shimmer_loading.dart';
import '../../../../core/widgets/error_screen.dart';
import '../../../../core/widgets/animated_counter.dart';
import '../../../categories/data/category_repository.dart';
import '../../../../services/vendor_service.dart';
import '../../../../services/location_service.dart';

// Category icon/color mapping
final _catIcons = <String, IconData>{
  'food-dining': Icons.restaurant, 'grocery': Icons.shopping_cart, 'pharmacy-health': Icons.local_pharmacy,
  'flowers-gifts': Icons.local_florist, 'pet-supplies': Icons.pets, 'packages-courier': Icons.local_shipping,
  'convenience-store': Icons.storefront, 'shopping': Icons.shopping_bag, 'home-services': Icons.build, 'water-gas': Icons.water_drop,
};
final _catColors = <String, Color>{
  'food-dining': const Color(0xFFFEF3C7), 'grocery': const Color(0xFFD1FAE5), 'pharmacy-health': const Color(0xFFDBEAFE),
  'flowers-gifts': const Color(0xFFFCE7F3), 'pet-supplies': const Color(0xFFFED7AA), 'packages-courier': const Color(0xFFE0E7FF),
  'convenience-store': const Color(0xFFFECACA), 'shopping': const Color(0xFFCCFBF1), 'home-services': const Color(0xFFF3E8FF), 'water-gas': const Color(0xFFBAE6FD),
};

// Vendors provider
final homeVendorsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  try {
    final pos = await LocationService().getCurrentLocation();
    final vendors = await VendorService().getNearbyVendors(latitude: pos?.latitude, longitude: pos?.longitude);
    return vendors.map((v) => {'name': v.name, 'slug': v.slug, 'rating': v.avgRating, 'time': '${v.avgPrepTimeMin ?? 25} min',
      'tag': v.deliveryFee == 0 ? 'Free delivery' : '\$${v.deliveryFee.toStringAsFixed(0)} delivery'}).toList();
  } catch (_) {
    return [];
  }
});

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final catState = ref.watch(categoryProvider);
    final vendorsAsync = ref.watch(homeVendorsProvider);

    return RefreshIndicator(
      color: DelivraTheme.primary,
      onRefresh: () async { ref.invalidate(categoryProvider); ref.invalidate(homeVendorsProvider); },
      child: CustomScrollView(slivers: [
        // Header
        SliverToBoxAdapter(child: Container(
          color: DelivraTheme.primary,
          padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 8, left: 20, right: 20, bottom: 24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.location_on, color: Colors.white, size: 20), const SizedBox(width: 8),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Delivering to', style: TextStyle(fontSize: 12, color: Colors.white.withAlpha(179))),
                const Row(children: [Text('Downtown, Dubai', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)), Icon(Icons.keyboard_arrow_down, color: Colors.white, size: 20)]),
              ]),
            ]),
            const SizedBox(height: 16),
            GestureDetector(onTap: () => context.go('/search'),
              child: Container(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12), decoration: BoxDecoration(color: Colors.white.withAlpha(38), borderRadius: BorderRadius.circular(12)),
                child: Row(children: [Icon(Icons.search, color: Colors.white.withAlpha(179), size: 20), const SizedBox(width: 10), Text('Search for anything...', style: TextStyle(color: Colors.white.withAlpha(179), fontSize: 14))]))),
          ]),
        )),

        // Promo
        SliverToBoxAdapter(child: Container(margin: const EdgeInsets.all(20), padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(gradient: const LinearGradient(colors: [DelivraTheme.primary, DelivraTheme.primaryLight]), borderRadius: BorderRadius.circular(16)),
          child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('50% OFF', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white)),
            SizedBox(height: 4), Text('Your first order! Use code WELCOME50', style: TextStyle(color: Colors.white70, fontSize: 13)),
          ]))),

        // Categories header
        SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text('Categories', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
            TextButton(onPressed: () {}, child: const Text('View All')),
          ]))),

        // Categories — REAL DATA with loading/error/empty
        SliverToBoxAdapter(child: catState.isLoading
          ? _shimmerGrid()
          : catState.error != null
            ? Padding(padding: const EdgeInsets.all(20), child: ErrorScreen(message: catState.error!, onRetry: () => ref.read(categoryProvider.notifier).loadCategories()))
            : catState.categories.isEmpty
              ? const Padding(padding: EdgeInsets.all(20), child: EmptyState(title: 'No categories', icon: Icons.category_outlined))
              : GridView.builder(
                  shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), padding: const EdgeInsets.symmetric(horizontal: 20),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 5, childAspectRatio: 0.75, crossAxisSpacing: 8, mainAxisSpacing: 8),
                  itemCount: catState.categories.length,
                  itemBuilder: (_, i) {
                    final cat = catState.categories[i];
                    return SlideInWidget(index: i, child: GestureDetector(
                      onTap: () => context.push('/category/${cat.slug}'),
                      child: Column(children: [
                        Container(width: 56, height: 56, decoration: BoxDecoration(color: _catColors[cat.slug] ?? const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(16)),
                          child: Icon(_catIcons[cat.slug] ?? Icons.category, size: 28, color: DelivraTheme.textPrimary)),
                        const SizedBox(height: 6),
                        Text(cat.name.split(' ').first, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600), textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis),
                      ]),
                    ));
                  })),

        const SliverToBoxAdapter(child: SizedBox(height: 24)),
        const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.symmetric(horizontal: 20), child: Text('Popular Near You', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)))),
        const SliverToBoxAdapter(child: SizedBox(height: 12)),

        // Vendors — REAL DATA with loading/error/empty
        SliverToBoxAdapter(child: vendorsAsync.when(
          loading: () => SizedBox(height: 200, child: ListView.separated(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 20),
            separatorBuilder: (_, __) => const SizedBox(width: 12), itemCount: 3, itemBuilder: (_, __) => const ShimmerVendorCard())),
          error: (_, __) => Padding(padding: const EdgeInsets.all(20), child: ErrorScreen(message: 'Failed to load vendors', onRetry: () => ref.invalidate(homeVendorsProvider))),
          data: (vendors) => vendors.isEmpty
            ? const Padding(padding: EdgeInsets.all(20), child: NoVendorsNearby())
            : SizedBox(height: 200, child: ListView.separated(
                scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 20),
                separatorBuilder: (_, __) => const SizedBox(width: 12), itemCount: vendors.length,
                itemBuilder: (_, i) {
                  final v = vendors[i];
                  return SlideInWidget(index: i, child: GestureDetector(
                    onTap: () => context.push('/vendor/${v['slug']}'),
                    child: Container(width: 180, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(13), blurRadius: 8, offset: const Offset(0, 2))]),
                      child: Column(children: [
                        Container(height: 110, decoration: BoxDecoration(color: DelivraTheme.border, borderRadius: const BorderRadius.vertical(top: Radius.circular(16))),
                          child: Center(child: Text(v['name'][0], style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w700, color: DelivraTheme.textHint)))),
                        Padding(padding: const EdgeInsets.all(12), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(v['name'], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 4),
                          Row(children: [const Icon(Icons.star, size: 14, color: Color(0xFFF59E0B)), Text(' ${v['rating']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                            const SizedBox(width: 8), Text(v['time'], style: const TextStyle(fontSize: 12, color: DelivraTheme.textHint))]),
                          const SizedBox(height: 6),
                          Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2), decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(99)),
                            child: Text(v['tag'], style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: DelivraTheme.primary))),
                        ])),
                      ])),
                  ));
                })),
        )),
        const SliverToBoxAdapter(child: SizedBox(height: 24)),
      ]),
    );
  }

  Widget _shimmerGrid() => GridView.builder(
    shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), padding: const EdgeInsets.symmetric(horizontal: 20),
    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 5, childAspectRatio: 0.75), itemCount: 10,
    itemBuilder: (_, __) => ShimmerLoading(child: Column(children: [
      Container(width: 56, height: 56, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(16))),
      const SizedBox(height: 6), Container(width: 40, height: 10, color: const Color(0xFFE2E8F0)),
    ])));
}
