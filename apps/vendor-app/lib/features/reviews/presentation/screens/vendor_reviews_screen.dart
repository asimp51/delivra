import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class VendorReviewsScreen extends StatelessWidget {
  const VendorReviewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final reviews = [
      _Rev('Ahmed Khan', 5, 'Best chicken in the city! Always fresh.', '2 hours ago', 'DLV-A8F2C'),
      _Rev('Sarah Ali', 4, 'Great food, slightly late delivery.', '5 hours ago', 'DLV-B3D1E'),
      _Rev('Omar Hassan', 5, 'Family bucket is amazing value!', '1 day ago', 'DLV-C7A9F'),
      _Rev('Fatima Noor', 3, 'Food was good but garlic bread was cold.', '2 days ago', 'DLV-D2E8B'),
      _Rev('Khalid Saeed', 5, 'Cheese burger is my absolute favorite!', '3 days ago', 'DLV-E1F4A'),
    ];
    final avg = reviews.fold<double>(0, (s, r) => s + r.rating) / reviews.length;

    return Scaffold(
      appBar: AppBar(title: const Text('Customer Reviews')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        // Summary
        Container(
          padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: VendorTheme.border)),
          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            Text(avg.toStringAsFixed(1), style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800)),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: List.generate(5, (i) => Icon(Icons.star, size: 18, color: i < avg.round() ? const Color(0xFFF59E0B) : VendorTheme.border))),
              Text('${reviews.length} reviews', style: const TextStyle(fontSize: 13, color: VendorTheme.textHint)),
            ]),
          ]),
        ),
        const SizedBox(height: 16),
        ...reviews.map((r) => Container(
          margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: VendorTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Container(width: 36, height: 36, decoration: BoxDecoration(color: VendorTheme.border, shape: BoxShape.circle),
                child: Center(child: Text(r.customer.split(' ').map((n) => n[0]).join(''), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: VendorTheme.textSecondary)))),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(r.customer, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                Row(children: [
                  ...List.generate(5, (i) => Icon(Icons.star, size: 14, color: i < r.rating ? const Color(0xFFF59E0B) : VendorTheme.border)),
                  const SizedBox(width: 8),
                  Text(r.time, style: const TextStyle(fontSize: 11, color: VendorTheme.textHint)),
                ]),
              ])),
              Text(r.orderId, style: const TextStyle(fontSize: 11, color: VendorTheme.primary, fontWeight: FontWeight.w600)),
            ]),
            const SizedBox(height: 10),
            Text(r.comment, style: const TextStyle(fontSize: 13, color: VendorTheme.textPrimary, height: 1.4)),
            const SizedBox(height: 8),
            GestureDetector(
              child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.reply, size: 16, color: VendorTheme.primary), SizedBox(width: 4), Text('Reply', style: TextStyle(color: VendorTheme.primary, fontWeight: FontWeight.w600, fontSize: 13))]),
            ),
          ]),
        )),
      ]),
    );
  }
}

class _Rev { final String customer, comment, time, orderId; final int rating; _Rev(this.customer, this.rating, this.comment, this.time, this.orderId); }
