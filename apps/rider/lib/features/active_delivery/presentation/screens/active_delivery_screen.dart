import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class ActiveDeliveryScreen extends StatefulWidget {
  final String orderId;
  const ActiveDeliveryScreen({super.key, required this.orderId});
  @override
  State<ActiveDeliveryScreen> createState() => _ActiveDeliveryScreenState();
}

class _ActiveDeliveryScreenState extends State<ActiveDeliveryScreen> {
  int _step = 0; // 0: Go to vendor, 1: Arrived, 2: Picked up, 3: At customer, 4: Delivered
  final _steps = ['Navigate to Vendor', 'Arrived at Vendor', 'Order Picked Up', 'Arrived at Customer', 'Delivered'];
  final _buttons = ['Arrived at Vendor', 'Picked Up', 'Arrived at Customer', 'Mark Delivered', 'Done'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Delivery ${widget.orderId}')),
      body: Column(
        children: [
          // Map placeholder
          Expanded(
            flex: 3,
            child: Container(
              color: const Color(0xFFE2E8F0),
              child: Center(
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const Icon(Icons.map, size: 64, color: RiderTheme.textHint),
                  const SizedBox(height: 8),
                  Text('Navigation Map', style: TextStyle(color: RiderTheme.textSecondary)),
                  const SizedBox(height: 4),
                  Text(_steps[_step], style: const TextStyle(fontWeight: FontWeight.w700, color: RiderTheme.primary)),
                ]),
              ),
            ),
          ),
          // Bottom panel
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              boxShadow: [BoxShadow(color: Colors.black.withAlpha(13), blurRadius: 10, offset: const Offset(0, -4))],
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              // Progress
              Row(children: List.generate(5, (i) => Expanded(
                child: Container(
                  height: 4,
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  decoration: BoxDecoration(
                    color: i <= _step ? RiderTheme.primary : RiderTheme.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ))),
              const SizedBox(height: 16),
              // Order info
              Row(children: [
                Container(
                  width: 48, height: 48,
                  decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(12)),
                  child: const Icon(Icons.store, color: RiderTheme.primary),
                ),
                const SizedBox(width: 12),
                const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Al Baik', style: TextStyle(fontWeight: FontWeight.w700)),
                  Text('3 items - \$48.78', style: TextStyle(fontSize: 13, color: RiderTheme.textSecondary)),
                ])),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(99)),
                  child: const Text('\$8.50', style: TextStyle(fontWeight: FontWeight.w800, color: RiderTheme.primary)),
                ),
              ]),
              const SizedBox(height: 16),
              // Addresses
              Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Column(children: [
                  Container(width: 10, height: 10, decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: RiderTheme.primary, width: 2))),
                  Container(width: 2, height: 30, color: RiderTheme.border),
                  Container(width: 10, height: 10, decoration: const BoxDecoration(shape: BoxShape.circle, color: RiderTheme.error)),
                ]),
                const SizedBox(width: 12),
                const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('King Fahd Road, Branch 5', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  SizedBox(height: 18),
                  Text('Downtown, Building 12', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                ])),
              ]),
              const SizedBox(height: 16),
              // Action buttons
              Row(children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.phone, size: 18),
                    label: const Text('Call'),
                    style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.navigation, size: 18),
                    label: const Text('Navigate'),
                    style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                  ),
                ),
              ]),
              const SizedBox(height: 12),
              if (_step < 4)
                ElevatedButton(
                  onPressed: () {
                    if (_step < 4) setState(() => _step++);
                    if (_step == 4) Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 52)),
                  child: Text(_buttons[_step]),
                ),
            ]),
          ),
        ],
      ),
    );
  }
}
