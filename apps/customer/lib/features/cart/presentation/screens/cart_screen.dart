import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cartItems = [
      _CartItem('Chicken Meal', 18.00, 2, 'Large, Spicy'),
      _CartItem('Garlic Bread', 6.50, 1, null),
      _CartItem('Pepsi 1L', 3.00, 1, null),
    ];
    final subtotal = cartItems.fold<double>(0, (s, i) => s + i.price * i.qty);
    const deliveryFee = 3.00;
    const tax = 2.28;
    final total = subtotal + deliveryFee + tax;

    return Scaffold(
      appBar: AppBar(title: const Text('Your Cart'), backgroundColor: Colors.white, foregroundColor: DelivraTheme.textPrimary, elevation: 0.5),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFFECFDF5),
            child: const Row(children: [
              Icon(Icons.store, color: DelivraTheme.primary, size: 20),
              SizedBox(width: 8),
              Text('Al Baik', style: TextStyle(fontWeight: FontWeight.w700, color: DelivraTheme.primary)),
              Spacer(),
              Text('25 min', style: TextStyle(fontSize: 13, color: DelivraTheme.primary)),
            ]),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              separatorBuilder: (_, __) => const Divider(),
              itemCount: cartItems.length,
              itemBuilder: (_, i) {
                final item = cartItems[i];
                return Row(
                  children: [
                    Container(
                      width: 48, height: 48,
                      decoration: BoxDecoration(color: DelivraTheme.border, borderRadius: BorderRadius.circular(10)),
                      child: Center(child: Text(item.name[0], style: const TextStyle(fontWeight: FontWeight.w700, color: DelivraTheme.textHint))),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(item.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                        if (item.options != null) Text(item.options!, style: const TextStyle(fontSize: 12, color: DelivraTheme.textHint)),
                      ]),
                    ),
                    Container(
                      decoration: BoxDecoration(border: Border.all(color: DelivraTheme.border), borderRadius: BorderRadius.circular(8)),
                      child: Row(mainAxisSize: MainAxisSize.min, children: [
                        IconButton(icon: const Icon(Icons.remove, size: 16), onPressed: () {}, constraints: const BoxConstraints(minWidth: 32, minHeight: 32), padding: EdgeInsets.zero),
                        Text('${item.qty}', style: const TextStyle(fontWeight: FontWeight.w700)),
                        IconButton(icon: const Icon(Icons.add, size: 16), onPressed: () {}, constraints: const BoxConstraints(minWidth: 32, minHeight: 32), padding: EdgeInsets.zero),
                      ]),
                    ),
                    const SizedBox(width: 12),
                    Text('\$${(item.price * item.qty).toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w700)),
                  ],
                );
              },
            ),
          ),
          // Promo code
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(children: [
              Expanded(child: TextField(decoration: InputDecoration(hintText: 'Promo code', prefixIcon: const Icon(Icons.local_offer, size: 20), contentPadding: const EdgeInsets.symmetric(horizontal: 12), border: OutlineInputBorder(borderRadius: BorderRadius.circular(10))))),
              const SizedBox(width: 8),
              ElevatedButton(onPressed: () {}, child: const Text('Apply')),
            ]),
          ),
          const SizedBox(height: 16),
          // Summary
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withAlpha(13), blurRadius: 10, offset: const Offset(0, -2))]),
            child: SafeArea(
              child: Column(children: [
                _SummaryRow('Subtotal', '\$${subtotal.toStringAsFixed(2)}'),
                _SummaryRow('Delivery Fee', '\$${deliveryFee.toStringAsFixed(2)}'),
                _SummaryRow('Tax', '\$${tax.toStringAsFixed(2)}'),
                const Divider(),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  const Text('Total', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                  Text('\$${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: DelivraTheme.primary)),
                ]),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () => context.push('/checkout'),
                  style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 52)),
                  child: const Text('Proceed to Checkout'),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

Widget _SummaryRow(String label, String value) => Padding(
  padding: const EdgeInsets.symmetric(vertical: 4),
  child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
    Text(label, style: const TextStyle(color: DelivraTheme.textSecondary)),
    Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
  ]),
);

class _CartItem {
  final String name;
  final double price;
  final int qty;
  final String? options;
  _CartItem(this.name, this.price, this.qty, this.options);
}
