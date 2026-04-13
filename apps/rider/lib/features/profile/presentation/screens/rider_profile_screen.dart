import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class RiderProfileScreen extends StatelessWidget {
  const RiderProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: RiderTheme.border)),
            child: Column(children: [
              Container(
                width: 80, height: 80,
                decoration: const BoxDecoration(color: RiderTheme.primary, shape: BoxShape.circle),
                child: const Center(child: Text('AM', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w700))),
              ),
              const SizedBox(height: 12),
              const Text('Ali Mohammed', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
              const Text('Motorcycle - ABC 1234', style: TextStyle(color: RiderTheme.textSecondary)),
              const SizedBox(height: 16),
              Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
                _ProfileStat('Rating', '4.9', Icons.star, RiderTheme.warning),
                _ProfileStat('Deliveries', '1,240', Icons.delivery_dining, RiderTheme.primary),
                _ProfileStat('Joined', 'Jun 2025', Icons.calendar_today, RiderTheme.textSecondary),
              ]),
            ]),
          ),
          const SizedBox(height: 20),
          ...[
            (Icons.person_outline, 'Personal Information'),
            (Icons.two_wheeler, 'Vehicle Details'),
            (Icons.description_outlined, 'Documents'),
            (Icons.account_balance, 'Bank Account'),
            (Icons.notifications_outlined, 'Notifications'),
            (Icons.help_outline, 'Help & Support'),
            (Icons.info_outline, 'About'),
          ].map((item) => Container(
            decoration: BoxDecoration(color: Colors.white, border: Border(bottom: BorderSide(color: RiderTheme.border.withAlpha(128)))),
            child: ListTile(
              leading: Icon(item.$1, color: RiderTheme.textSecondary),
              title: Text(item.$2, style: const TextStyle(fontWeight: FontWeight.w500)),
              trailing: const Icon(Icons.chevron_right, color: RiderTheme.textHint),
            ),
          )),
          const SizedBox(height: 20),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.logout, color: RiderTheme.error),
            label: const Text('Sign Out', style: TextStyle(color: RiderTheme.error)),
            style: OutlinedButton.styleFrom(side: const BorderSide(color: RiderTheme.error), padding: const EdgeInsets.symmetric(vertical: 14)),
          ),
        ],
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final Color color;
  const _ProfileStat(this.label, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Icon(icon, color: color, size: 20),
      const SizedBox(height: 4),
      Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
      Text(label, style: const TextStyle(fontSize: 11, color: RiderTheme.textHint)),
    ]);
  }
}
