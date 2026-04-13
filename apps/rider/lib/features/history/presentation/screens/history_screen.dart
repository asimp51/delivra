import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final deliveries = [
      _Del('DLV-K2M8', 'Al Baik', 'Downtown, Bldg 12', 8.50, '22 min', '11:45 AM'),
      _Del('DLV-J9F3', 'Pizza Hut', 'Al Malqa, Villa 8', 12.00, '28 min', '10:30 AM'),
      _Del('DLV-H4R1', 'Carrefour', 'Riyadh Park', 7.50, '18 min', '9:15 AM'),
      _Del('DLV-G7P5', 'Subway', 'King Abdullah Rd', 6.00, '15 min', 'Yesterday'),
      _Del('DLV-F2N8', 'Nahdi', 'Embassy Quarter', 9.00, '20 min', 'Yesterday'),
      _Del('DLV-E1A4', 'Shawarma House', 'Exit 10 Area', 7.00, '25 min', 'Yesterday'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Delivery History')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemCount: deliveries.length,
        itemBuilder: (_, i) {
          final d = deliveries[i];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: RiderTheme.border)),
            child: Row(children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.check_circle, color: RiderTheme.primary),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(d.vendor, style: const TextStyle(fontWeight: FontWeight.w600)),
                  Text('+\$${d.earning.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w700, color: RiderTheme.primary)),
                ]),
                const SizedBox(height: 2),
                Text('${d.orderId} - ${d.address}', style: const TextStyle(fontSize: 12, color: RiderTheme.textHint)),
                const SizedBox(height: 2),
                Text('${d.time} - ${d.duration}', style: const TextStyle(fontSize: 12, color: RiderTheme.textHint)),
              ])),
            ]),
          );
        },
      ),
    );
  }
}

class _Del {
  final String orderId, vendor, address, duration, time;
  final double earning;
  _Del(this.orderId, this.vendor, this.address, this.earning, this.duration, this.time);
}
