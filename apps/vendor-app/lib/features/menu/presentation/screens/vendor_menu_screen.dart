import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class _MenuItem { final String name, desc, cat; final double price; final double? discount; final bool available; _MenuItem(this.name, this.desc, this.price, this.cat, {this.discount, this.available = true}); }

class VendorMenuScreen extends StatefulWidget {
  const VendorMenuScreen({super.key});
  @override
  State<VendorMenuScreen> createState() => _VendorMenuScreenState();
}

class _VendorMenuScreenState extends State<VendorMenuScreen> {
  String _activeCat = 'All';
  final _cats = ['All', 'Meals', 'Burgers', 'Snacks', 'Sides', 'Beverages'];
  final _items = [
    _MenuItem('Chicken Meal', 'Crispy fried chicken with fries', 18.00, 'Meals'),
    _MenuItem('Broasted Combo', 'Broasted chicken, rice, hummus', 22.50, 'Meals'),
    _MenuItem('Family Bucket', '12pc chicken + sides', 65.00, 'Meals'),
    _MenuItem('Cheese Burger', 'Beef patty with cheese', 12.00, 'Burgers', discount: 9.99),
    _MenuItem('Nuggets Box', '20pc crispy nuggets', 15.00, 'Snacks'),
    _MenuItem('Shrimp Meal', 'Grilled shrimp with rice', 28.00, 'Meals', available: false),
    _MenuItem('French Fries', 'Crispy golden fries', 5.00, 'Sides'),
    _MenuItem('Pepsi 1L', 'Chilled bottle', 3.00, 'Beverages'),
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _activeCat == 'All' ? _items : _items.where((i) => i.cat == _activeCat).toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Menu Management'), actions: [
        IconButton(icon: const Icon(Icons.add_circle, color: VendorTheme.primary), onPressed: () {}),
      ]),
      body: Column(children: [
        SizedBox(height: 50, child: ListView.separated(
          scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          separatorBuilder: (_, __) => const SizedBox(width: 8), itemCount: _cats.length,
          itemBuilder: (_, i) => GestureDetector(
            onTap: () => setState(() => _activeCat = _cats[i]),
            child: Container(padding: const EdgeInsets.symmetric(horizontal: 16), decoration: BoxDecoration(
              color: _activeCat == _cats[i] ? VendorTheme.primary : Colors.white,
              borderRadius: BorderRadius.circular(20), border: Border.all(color: _activeCat == _cats[i] ? VendorTheme.primary : VendorTheme.border)),
              alignment: Alignment.center, child: Text(_cats[i], style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: _activeCat == _cats[i] ? Colors.white : VendorTheme.textSecondary))),
          ),
        )),
        Expanded(child: ListView.separated(
          padding: const EdgeInsets.all(16), separatorBuilder: (_, __) => const SizedBox(height: 8), itemCount: filtered.length,
          itemBuilder: (_, i) {
            final item = filtered[i];
            return Container(
              padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: VendorTheme.border)),
              child: Row(children: [
                Container(width: 56, height: 56, decoration: BoxDecoration(color: VendorTheme.border, borderRadius: BorderRadius.circular(10)),
                  child: Center(child: Text(item.name[0], style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: VendorTheme.textHint)))),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Expanded(child: Text(item.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14))),
                    Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: VendorTheme.border, borderRadius: BorderRadius.circular(4)),
                      child: Text(item.cat, style: const TextStyle(fontSize: 10, color: VendorTheme.textSecondary))),
                  ]),
                  Text(item.desc, style: const TextStyle(fontSize: 12, color: VendorTheme.textHint), maxLines: 1, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  Row(children: [
                    if (item.discount != null) Text('\$${item.price}', style: const TextStyle(fontSize: 12, color: VendorTheme.textHint, decoration: TextDecoration.lineThrough)),
                    if (item.discount != null) const SizedBox(width: 4),
                    Text('\$${(item.discount ?? item.price).toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w700, color: VendorTheme.primary)),
                  ]),
                ])),
                Column(children: [
                  Switch(value: item.available, onChanged: (_) {}, activeColor: VendorTheme.success, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
                  Text(item.available ? 'Available' : 'Unavailable', style: TextStyle(fontSize: 9, color: item.available ? VendorTheme.success : VendorTheme.error)),
                ]),
              ]),
            );
          },
        )),
      ]),
    );
  }
}
