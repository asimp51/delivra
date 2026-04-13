import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';

class VendorDetailScreen extends StatelessWidget {
  final String slug;
  const VendorDetailScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    final menuItems = [
      _MenuItem('Chicken Meal', 'Crispy fried chicken with fries', 18.00, null),
      _MenuItem('Broasted Combo', 'Broasted chicken, rice, hummus', 22.50, null),
      _MenuItem('Family Bucket', '12pc chicken, 4 fries, 2L Pepsi', 65.00, null),
      _MenuItem('Cheese Burger', 'Beef patty with cheese & sauce', 12.00, 9.99),
      _MenuItem('Nuggets Box', '20pc crispy chicken nuggets', 15.00, null),
      _MenuItem('Shrimp Meal', 'Grilled shrimp with garlic sauce', 28.00, null),
      _MenuItem('French Fries', 'Crispy golden fries', 5.00, null),
      _MenuItem('Pepsi 1L', 'Chilled Pepsi bottle', 3.00, null),
    ];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(slug.replaceAll('-', ' ').split(' ').map((w) => '${w[0].toUpperCase()}${w.substring(1)}').join(' ')),
              background: Container(color: DelivraTheme.border, child: const Center(child: Icon(Icons.store, size: 64, color: DelivraTheme.textHint))),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(children: [
                const Icon(Icons.star, color: Color(0xFFF59E0B), size: 18),
                const Text(' 4.8', style: TextStyle(fontWeight: FontWeight.w700)),
                const Text(' (2,340)', style: TextStyle(color: DelivraTheme.textHint, fontSize: 13)),
                const SizedBox(width: 16),
                const Icon(Icons.access_time, color: DelivraTheme.textHint, size: 18),
                const Text(' 25 min', style: TextStyle(color: DelivraTheme.textHint, fontSize: 13)),
                const SizedBox(width: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(99)),
                  child: const Text('Free delivery', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: DelivraTheme.primary)),
                ),
              ]),
            ),
          ),
          const SliverToBoxAdapter(child: Divider()),
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(16, 8, 16, 12),
              child: Text('Menu', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
            ),
          ),
          SliverList.separated(
            separatorBuilder: (_, __) => const Divider(height: 1, indent: 16, endIndent: 16),
            itemCount: menuItems.length,
            itemBuilder: (_, i) {
              final item = menuItems[i];
              return ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: Container(
                  width: 64, height: 64,
                  decoration: BoxDecoration(color: DelivraTheme.border, borderRadius: BorderRadius.circular(12)),
                  child: Center(child: Text(item.name[0], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: DelivraTheme.textHint))),
                ),
                title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                subtitle: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(item.desc, style: const TextStyle(fontSize: 12, color: DelivraTheme.textHint), maxLines: 1),
                  const SizedBox(height: 4),
                  Row(children: [
                    if (item.discount != null) ...[
                      Text('\$${item.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, color: DelivraTheme.textHint, decoration: TextDecoration.lineThrough)),
                      const SizedBox(width: 4),
                    ],
                    Text('\$${(item.discount ?? item.price).toStringAsFixed(2)}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: DelivraTheme.primary)),
                  ]),
                ]),
                trailing: Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(color: DelivraTheme.primary, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.add, color: Colors.white, size: 20),
                ),
              );
            },
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withAlpha(13), blurRadius: 10, offset: const Offset(0, -2))]),
        child: SafeArea(
          child: ElevatedButton(
            onPressed: () => context.push('/cart'),
            style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 52)),
            child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(Icons.shopping_cart_rounded, size: 20),
              SizedBox(width: 8),
              Text('View Cart (3 items) - \$45.50'),
            ]),
          ),
        ),
      ),
    );
  }
}

class _MenuItem {
  final String name, desc;
  final double price;
  final double? discount;
  _MenuItem(this.name, this.desc, this.price, this.discount);
}
