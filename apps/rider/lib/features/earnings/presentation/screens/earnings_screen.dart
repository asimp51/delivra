import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class EarningsScreen extends StatelessWidget {
  const EarningsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Earnings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Total earnings card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [RiderTheme.primary, Color(0xFF10B981)]),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Column(children: [
              Text('Total Earnings', style: TextStyle(color: Colors.white70, fontSize: 14)),
              SizedBox(height: 4),
              Text('\$8,450.00', style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w800)),
              SizedBox(height: 16),
              Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
                Column(children: [
                  Text('Today', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  SizedBox(height: 2),
                  Text('\$42.50', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
                ]),
                Column(children: [
                  Text('This Week', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  SizedBox(height: 2),
                  Text('\$285.00', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
                ]),
                Column(children: [
                  Text('This Month', style: TextStyle(color: Colors.white70, fontSize: 12)),
                  SizedBox(height: 2),
                  Text('\$1,120.00', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
                ]),
              ]),
            ]),
          ),
          const SizedBox(height: 20),
          // Weekly chart
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: RiderTheme.border)),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Weekly Earnings', style: TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 16),
              SizedBox(
                height: 120,
                child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  for (final d in [32, 48, 38, 42, 55, 60, 28])
                    Expanded(child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
                        Text('\$$d', style: const TextStyle(fontSize: 10, color: RiderTheme.textHint)),
                        const SizedBox(height: 4),
                        Container(height: d * 1.5, decoration: BoxDecoration(color: RiderTheme.primary.withAlpha(179), borderRadius: BorderRadius.circular(6))),
                      ]),
                    )),
                ]),
              ),
              const SizedBox(height: 8),
              const Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
                Text('Mon', style: TextStyle(fontSize: 11, color: RiderTheme.textHint)),
                Text('Tue', style: TextStyle(fontSize: 11, color: RiderTheme.textHint)),
                Text('Wed', style: TextStyle(fontSize: 11, color: RiderTheme.textHint)),
                Text('Thu', style: TextStyle(fontSize: 11, color: RiderTheme.textHint)),
                Text('Fri', style: TextStyle(fontSize: 11, color: RiderTheme.textHint)),
                Text('Sat', style: TextStyle(fontSize: 11, color: RiderTheme.textHint)),
                Text('Sun', style: TextStyle(fontSize: 11, color: RiderTheme.textHint)),
              ]),
            ]),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.account_balance),
            label: const Text('Withdraw to Bank'),
            style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 52)),
          ),
        ],
      ),
    );
  }
}
