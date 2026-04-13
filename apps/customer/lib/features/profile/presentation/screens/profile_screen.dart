import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile'), backgroundColor: Colors.white, foregroundColor: DelivraTheme.textPrimary, elevation: 0.5),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: DelivraTheme.border)),
            child: Row(children: [
              Container(
                width: 64, height: 64,
                decoration: BoxDecoration(color: DelivraTheme.primary, shape: BoxShape.circle),
                child: const Center(child: Text('AK', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700))),
              ),
              const SizedBox(width: 16),
              const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Ahmed Khan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                SizedBox(height: 2),
                Text('ahmed@email.com', style: TextStyle(color: DelivraTheme.textSecondary)),
                Text('+966 50 123 4567', style: TextStyle(color: DelivraTheme.textHint, fontSize: 13)),
              ]),
            ]),
          ),
          const SizedBox(height: 20),
          ...[
            (Icons.location_on_outlined, 'Saved Addresses', '3 addresses'),
            (Icons.credit_card, 'Payment Methods', 'Visa **** 4242'),
            (Icons.local_offer_outlined, 'Promo Codes', '2 available'),
            (Icons.favorite_outline, 'Favorites', '5 restaurants'),
            (Icons.notifications_outlined, 'Notifications', 'Manage alerts'),
            (Icons.language, 'Language', 'English'),
            (Icons.help_outline, 'Help & Support', 'FAQ, contact us'),
            (Icons.info_outline, 'About Delivra', 'v1.0.0'),
          ].map((item) => Container(
            margin: const EdgeInsets.only(bottom: 2),
            decoration: BoxDecoration(color: Colors.white, border: Border(bottom: BorderSide(color: DelivraTheme.border.withAlpha(128)))),
            child: ListTile(
              leading: Icon(item.$1, color: DelivraTheme.textSecondary),
              title: Text(item.$2, style: const TextStyle(fontWeight: FontWeight.w500)),
              subtitle: Text(item.$3, style: const TextStyle(fontSize: 12, color: DelivraTheme.textHint)),
              trailing: const Icon(Icons.chevron_right, color: DelivraTheme.textHint),
            ),
          )),
          const SizedBox(height: 20),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.logout, color: DelivraTheme.error),
            label: const Text('Sign Out', style: TextStyle(color: DelivraTheme.error)),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: DelivraTheme.error),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }
}
