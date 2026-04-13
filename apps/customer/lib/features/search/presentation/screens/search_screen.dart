import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white, elevation: 0.5,
        title: TextField(
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Search restaurants, items...',
            prefixIcon: const Icon(Icons.search),
            filled: true, fillColor: DelivraTheme.surface,
            contentPadding: const EdgeInsets.symmetric(vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Popular Searches', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final term in ['Pizza', 'Burger', 'Chicken', 'Sushi', 'Coffee', 'Grocery', 'Pharmacy', 'Flowers', 'Water', 'Laundry'])
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: DelivraTheme.border)),
                child: Text(term, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
              ),
          ]),
          const SizedBox(height: 32),
          const Text('Recent Searches', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          ...['Al Baik', 'Carrefour', 'Pizza Hut'].map((s) => ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.history, color: DelivraTheme.textHint),
            title: Text(s),
            trailing: const Icon(Icons.north_west, color: DelivraTheme.textHint, size: 18),
          )),
        ]),
      ),
    );
  }
}
