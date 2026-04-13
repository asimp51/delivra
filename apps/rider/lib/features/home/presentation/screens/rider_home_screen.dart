import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';

class _DeliveryOffer {
  final String orderId, vendorName, vendorAddress, customerAddress;
  final double distance, earning;
  final int items;
  _DeliveryOffer({required this.orderId, required this.vendorName, required this.vendorAddress, required this.customerAddress, required this.distance, required this.earning, required this.items});
}

class RiderHomeScreen extends StatefulWidget {
  const RiderHomeScreen({super.key});
  @override
  State<RiderHomeScreen> createState() => _RiderHomeScreenState();
}

class _RiderHomeScreenState extends State<RiderHomeScreen> {
  bool _isOnline = true;

  final _offers = [
    _DeliveryOffer(orderId: 'DLV-K2M8', vendorName: 'Al Baik', vendorAddress: 'King Fahd Road, Branch 5', customerAddress: 'Downtown, Building 12', distance: 3.2, earning: 8.50, items: 3),
    _DeliveryOffer(orderId: 'DLV-L9N3', vendorName: 'Pizza Hut', vendorAddress: 'Olaya Mall, Ground Floor', customerAddress: 'Al Malqa, Villa 8', distance: 5.1, earning: 12.00, items: 2),
    _DeliveryOffer(orderId: 'DLV-M4P7', vendorName: 'Carrefour', vendorAddress: 'Panorama Mall', customerAddress: 'Riyadh Park Area', distance: 2.8, earning: 7.50, items: 8),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(color: RiderTheme.primary, borderRadius: BorderRadius.circular(10)),
            child: const Icon(Icons.delivery_dining, color: Colors.white, size: 22),
          ),
          const SizedBox(width: 10),
          const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Delivra Rider', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            Text('Available Orders', style: TextStyle(fontSize: 12, color: RiderTheme.textHint)),
          ]),
        ]),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            child: Switch(
              value: _isOnline,
              onChanged: (v) => setState(() => _isOnline = v),
              activeColor: RiderTheme.success,
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Status bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            color: _isOnline ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
            child: Row(children: [
              Container(
                width: 10, height: 10,
                decoration: BoxDecoration(shape: BoxShape.circle, color: _isOnline ? RiderTheme.success : RiderTheme.error),
              ),
              const SizedBox(width: 8),
              Text(
                _isOnline ? 'You are online — ${_offers.length} orders nearby' : 'You are offline',
                style: TextStyle(fontWeight: FontWeight.w600, color: _isOnline ? RiderTheme.primary : RiderTheme.error),
              ),
            ]),
          ),
          // Today's stats
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(children: [
              _StatCard('Today\'s Earnings', '\$42.50', Icons.attach_money, RiderTheme.success),
              const SizedBox(width: 12),
              _StatCard('Deliveries', '6', Icons.delivery_dining, RiderTheme.primary),
              const SizedBox(width: 12),
              _StatCard('Avg Time', '22 min', Icons.timer, RiderTheme.warning),
            ]),
          ),
          // Available orders
          if (_isOnline)
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemCount: _offers.length,
                itemBuilder: (_, i) {
                  final o = _offers[i];
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: RiderTheme.border)),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        Text(o.orderId, style: const TextStyle(fontWeight: FontWeight.w700, color: RiderTheme.primary)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(99)),
                          child: Text('\$${o.earning.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w800, color: RiderTheme.primary)),
                        ),
                      ]),
                      const SizedBox(height: 12),
                      // Pickup
                      Row(children: [
                        Container(width: 10, height: 10, decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: RiderTheme.primary, width: 2))),
                        const SizedBox(width: 10),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          const Text('PICKUP', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: RiderTheme.textHint, letterSpacing: 1)),
                          Text(o.vendorName, style: const TextStyle(fontWeight: FontWeight.w600)),
                          Text(o.vendorAddress, style: const TextStyle(fontSize: 12, color: RiderTheme.textHint)),
                        ])),
                      ]),
                      Container(margin: const EdgeInsets.only(left: 4), width: 2, height: 20, color: RiderTheme.border),
                      // Dropoff
                      Row(children: [
                        Container(width: 10, height: 10, decoration: const BoxDecoration(shape: BoxShape.circle, color: RiderTheme.error)),
                        const SizedBox(width: 10),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          const Text('DROPOFF', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: RiderTheme.textHint, letterSpacing: 1)),
                          Text(o.customerAddress, style: const TextStyle(fontWeight: FontWeight.w600)),
                        ])),
                      ]),
                      const SizedBox(height: 12),
                      Row(children: [
                        Icon(Icons.straighten, size: 16, color: RiderTheme.textHint),
                        Text(' ${o.distance} km', style: const TextStyle(fontSize: 13, color: RiderTheme.textSecondary)),
                        const SizedBox(width: 16),
                        Icon(Icons.shopping_bag, size: 16, color: RiderTheme.textHint),
                        Text(' ${o.items} items', style: const TextStyle(fontSize: 13, color: RiderTheme.textSecondary)),
                      ]),
                      const SizedBox(height: 12),
                      Row(children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {},
                            style: OutlinedButton.styleFrom(foregroundColor: RiderTheme.error, side: const BorderSide(color: RiderTheme.error)),
                            child: const Text('Decline'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => context.push('/delivery/${o.orderId}'),
                            child: const Text('Accept'),
                          ),
                        ),
                      ]),
                    ]),
                  );
                },
              ),
            ),
          if (!_isOnline)
            const Expanded(child: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(Icons.wifi_off, size: 64, color: RiderTheme.textHint),
              SizedBox(height: 16),
              Text('Go online to see orders', style: TextStyle(fontSize: 16, color: RiderTheme.textSecondary)),
            ]))),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final Color color;
  const _StatCard(this.label, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: RiderTheme.border)),
        child: Column(children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
          Text(label, style: const TextStyle(fontSize: 10, color: RiderTheme.textHint), textAlign: TextAlign.center),
        ]),
      ),
    );
  }
}
