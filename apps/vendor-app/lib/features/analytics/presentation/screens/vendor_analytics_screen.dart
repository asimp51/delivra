import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class VendorAnalyticsScreen extends StatelessWidget {
  const VendorAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        // KPI cards
        Row(children: [
          _KpiCard('Today\'s Revenue', '\$1,284', Icons.attach_money, VendorTheme.success, '+12%'),
          const SizedBox(width: 12),
          _KpiCard('Orders', '47', Icons.receipt, VendorTheme.primary, '+8%'),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          _KpiCard('Avg Prep Time', '18 min', Icons.timer, VendorTheme.warning, '-3 min'),
          const SizedBox(width: 12),
          _KpiCard('Rating', '4.8', Icons.star, const Color(0xFFF59E0B), '+0.1'),
        ]),
        const SizedBox(height: 20),
        // Revenue chart
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: VendorTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Weekly Revenue', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
            const SizedBox(height: 16),
            SizedBox(height: 140, child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
              for (final d in [820, 1100, 950, 1284, 1150, 1400, 980])
                Expanded(child: Padding(padding: const EdgeInsets.symmetric(horizontal: 3), child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
                  Text('\$${(d / 1000).toStringAsFixed(1)}k', style: const TextStyle(fontSize: 9, color: VendorTheme.textHint)),
                  const SizedBox(height: 4),
                  AnimatedContainer(duration: const Duration(milliseconds: 600), height: (d / 1400) * 100, decoration: BoxDecoration(color: VendorTheme.primary.withAlpha(179), borderRadius: BorderRadius.circular(6))),
                ]))),
            ])),
            const SizedBox(height: 8),
            Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => Text(d, style: const TextStyle(fontSize: 10, color: VendorTheme.textHint))).toList()),
          ]),
        ),
        const SizedBox(height: 20),
        // Top items
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: VendorTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Top Selling Items', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
            const SizedBox(height: 12),
            ...[('Chicken Meal', 342, 6156), ('Family Bucket', 185, 12025), ('Cheese Burger', 410, 4099), ('Broasted Combo', 278, 6255), ('Nuggets Box', 195, 2925)].asMap().entries.map((e) {
              final i = e.key; final item = e.value;
              return Padding(padding: const EdgeInsets.only(bottom: 12), child: Row(children: [
                Container(width: 24, height: 24, decoration: BoxDecoration(color: VendorTheme.primary.withAlpha(25), shape: BoxShape.circle),
                  child: Center(child: Text('${i + 1}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: VendorTheme.primary)))),
                const SizedBox(width: 10),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text(item.$1, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)), Text('\$${item.$3}', style: const TextStyle(fontWeight: FontWeight.w700, color: VendorTheme.primary, fontSize: 13))]),
                  const SizedBox(height: 4),
                  ClipRRect(borderRadius: BorderRadius.circular(4), child: LinearProgressIndicator(value: item.$2 / 410, backgroundColor: VendorTheme.border, color: VendorTheme.primary, minHeight: 6)),
                  const SizedBox(height: 2),
                  Text('${item.$2} sold', style: const TextStyle(fontSize: 11, color: VendorTheme.textHint)),
                ])),
              ]));
            }),
          ]),
        ),
      ]),
    );
  }
}

class _KpiCard extends StatelessWidget {
  final String label, value, change; final IconData icon; final Color color;
  const _KpiCard(this.label, this.value, this.icon, this.color, this.change);
  @override
  Widget build(BuildContext context) => Expanded(child: Container(
    padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: VendorTheme.border)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Icon(icon, color: color, size: 22),
        Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: VendorTheme.success.withAlpha(25), borderRadius: BorderRadius.circular(99)),
          child: Text(change, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: VendorTheme.success))),
      ]),
      const SizedBox(height: 8),
      Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
      Text(label, style: const TextStyle(fontSize: 12, color: VendorTheme.textHint)),
    ]),
  ));
}
