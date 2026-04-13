import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class VendorSettingsScreen extends StatelessWidget {
  const VendorSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return Scaffold(
      appBar: AppBar(title: const Text('Store Settings')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        // Store Profile
        Container(
          padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: VendorTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Store Profile', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            const Divider(),
            Row(children: [
              Container(width: 64, height: 64, decoration: BoxDecoration(color: VendorTheme.primary.withAlpha(25), borderRadius: BorderRadius.circular(16)),
                child: const Center(child: Text('AB', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: VendorTheme.primary)))),
              const SizedBox(width: 16),
              ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.upload, size: 18), label: const Text('Change Logo'), style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: VendorTheme.textSecondary, side: const BorderSide(color: VendorTheme.border))),
            ]),
            const SizedBox(height: 16),
            const TextField(decoration: InputDecoration(labelText: 'Store Name'), controller: null),
            const SizedBox(height: 12),
            const TextField(decoration: InputDecoration(labelText: 'Phone'), keyboardType: TextInputType.phone),
            const SizedBox(height: 12),
            const TextField(decoration: InputDecoration(labelText: 'Description'), maxLines: 2),
          ]),
        ),
        const SizedBox(height: 16),

        // Operating Hours
        Container(
          padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: VendorTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Operating Hours', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            const Divider(),
            ...days.asMap().entries.map((e) {
              final i = e.key;
              final day = e.value;
              final isClosed = i == 5; // Friday closed by default
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(children: [
                  SizedBox(width: 90, child: Text(day, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500))),
                  Expanded(child: isClosed
                    ? const Text('Closed', style: TextStyle(color: VendorTheme.error, fontWeight: FontWeight.w600, fontSize: 13))
                    : Row(children: [
                        Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(border: Border.all(color: VendorTheme.border), borderRadius: BorderRadius.circular(8)),
                          child: Text(i == 5 ? '--:--' : '09:00', style: const TextStyle(fontSize: 13))),
                        const Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: Text('to', style: TextStyle(color: VendorTheme.textHint))),
                        Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(border: Border.all(color: VendorTheme.border), borderRadius: BorderRadius.circular(8)),
                          child: const Text('23:00', style: TextStyle(fontSize: 13))),
                      ])),
                  Switch(value: !isClosed, onChanged: (_) {}, activeColor: VendorTheme.success, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
                ]),
              );
            }),
          ]),
        ),
        const SizedBox(height: 16),

        // Delivery Settings
        Container(
          padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: VendorTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Delivery Settings', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            const Divider(),
            Row(children: [
              Expanded(child: TextField(decoration: const InputDecoration(labelText: 'Delivery Fee (\$)'), keyboardType: TextInputType.number, controller: TextEditingController(text: '3.00'))),
              const SizedBox(width: 12),
              Expanded(child: TextField(decoration: const InputDecoration(labelText: 'Min Order (\$)'), keyboardType: TextInputType.number, controller: TextEditingController(text: '10.00'))),
            ]),
            const SizedBox(height: 12),
            TextField(decoration: const InputDecoration(labelText: 'Avg Prep Time (minutes)'), keyboardType: TextInputType.number, controller: TextEditingController(text: '20')),
          ]),
        ),
        const SizedBox(height: 20),
        ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.save), label: const Text('Save Settings'), style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 52))),
        const SizedBox(height: 12),
        OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.logout, color: VendorTheme.error), label: const Text('Sign Out', style: TextStyle(color: VendorTheme.error)),
          style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 52), side: const BorderSide(color: VendorTheme.error))),
        const SizedBox(height: 24),
      ]),
    );
  }
}
