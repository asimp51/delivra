import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});
  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String _payment = 'card';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout'), backgroundColor: Colors.white, foregroundColor: DelivraTheme.textPrimary, elevation: 0.5),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Delivery address
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: DelivraTheme.border)),
            child: Row(children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.location_on, color: DelivraTheme.primary),
              ),
              const SizedBox(width: 12),
              const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Delivery Address', style: TextStyle(fontSize: 12, color: DelivraTheme.textHint)),
                SizedBox(height: 2),
                Text('Downtown, Building 5, Apt 12', style: TextStyle(fontWeight: FontWeight.w600)),
              ])),
              const Icon(Icons.chevron_right, color: DelivraTheme.textHint),
            ]),
          ),
          const SizedBox(height: 20),
          const Text('Payment Method', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          ...[
            ('card', Icons.credit_card, 'Credit/Debit Card', '**** 4242'),
            ('cash', Icons.money, 'Cash on Delivery', 'Pay when delivered'),
            ('wallet', Icons.account_balance_wallet, 'Wallet', 'Balance: \$42.50'),
          ].map((p) => GestureDetector(
            onTap: () => setState(() => _payment = p.$1),
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _payment == p.$1 ? DelivraTheme.primary : DelivraTheme.border, width: _payment == p.$1 ? 2 : 1),
              ),
              child: Row(children: [
                Icon(p.$2, color: _payment == p.$1 ? DelivraTheme.primary : DelivraTheme.textHint),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(p.$3, style: const TextStyle(fontWeight: FontWeight.w600)),
                  Text(p.$4, style: const TextStyle(fontSize: 12, color: DelivraTheme.textHint)),
                ])),
                if (_payment == p.$1) const Icon(Icons.check_circle, color: DelivraTheme.primary),
              ]),
            ),
          )),
          const SizedBox(height: 20),
          const Text('Special Instructions', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          const TextField(maxLines: 3, decoration: InputDecoration(hintText: 'Any special instructions for the restaurant...')),
        ]),
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withAlpha(13), blurRadius: 10)]),
        child: SafeArea(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('Total', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              const Text('\$48.78', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: DelivraTheme.primary)),
            ]),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => context.push('/tracking/DLV-K2M8'),
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 52)),
              child: const Text('Place Order'),
            ),
          ]),
        ),
      ),
    );
  }
}
