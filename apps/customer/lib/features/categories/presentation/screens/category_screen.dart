import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';

class CategoryScreen extends StatelessWidget {
  final String slug;
  const CategoryScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    final subcategories = ['All', 'Restaurants', 'Fast Food', 'Cafe', 'Desserts', 'Healthy', 'Asian', 'Pizza', 'Burgers'];
    final vendors = List.generate(8, (i) => _MockVendor(
      name: ['Al Baik', 'Pizza Hut', 'Hardees', 'KFC', 'Subway', 'Shawarma House', 'Sushi Club', 'Burger King'][i],
      rating: [4.8, 4.1, 4.3, 4.2, 4.0, 4.6, 4.5, 3.9][i],
      time: '${20 + i * 5} min',
      deliveryFee: i % 3 == 0 ? 'Free delivery' : '\$${(i + 1).toDouble()} delivery',
    ));

    return Scaffold(
      appBar: AppBar(
        title: Text(slug.replaceAll('-', ' ').split(' ').map((w) => '${w[0].toUpperCase()}${w.substring(1)}').join(' ')),
      ),
      body: Column(
        children: [
          // Sub-categories
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemCount: subcategories.length,
              itemBuilder: (_, i) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: i == 0 ? DelivraTheme.primary : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: i == 0 ? DelivraTheme.primary : DelivraTheme.border),
                ),
                alignment: Alignment.center,
                child: Text(subcategories[i], style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: i == 0 ? Colors.white : DelivraTheme.textSecondary)),
              ),
            ),
          ),
          // Vendor list
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemCount: vendors.length,
              itemBuilder: (_, i) {
                final v = vendors[i];
                return GestureDetector(
                  onTap: () => context.push('/vendor/${v.name.toLowerCase().replaceAll(' ', '-')}'),
                  child: Container(
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 8)]),
                    child: Row(children: [
                      Container(
                        width: 100, height: 100,
                        decoration: BoxDecoration(color: DelivraTheme.border, borderRadius: const BorderRadius.horizontal(left: Radius.circular(16))),
                        child: Center(child: Text(v.name[0], style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w700, color: DelivraTheme.textHint))),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(v.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                            const SizedBox(height: 4),
                            Row(children: [
                              const Icon(Icons.star, size: 14, color: Color(0xFFF59E0B)),
                              Text(' ${v.rating}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                              const SizedBox(width: 12),
                              const Icon(Icons.access_time, size: 14, color: DelivraTheme.textHint),
                              Text(' ${v.time}', style: const TextStyle(fontSize: 12, color: DelivraTheme.textHint)),
                            ]),
                            const SizedBox(height: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(99)),
                              child: Text(v.deliveryFee, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: DelivraTheme.primary)),
                            ),
                          ]),
                        ),
                      ),
                    ]),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _MockVendor {
  final String name;
  final double rating;
  final String time;
  final String deliveryFee;
  _MockVendor({required this.name, required this.rating, required this.time, required this.deliveryFee});
}
