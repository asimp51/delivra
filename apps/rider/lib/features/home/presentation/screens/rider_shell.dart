import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';

class RiderShell extends StatelessWidget {
  final Widget child;
  const RiderShell({super.key, required this.child});

  int _getIndex(String loc) {
    if (loc.startsWith('/earnings')) return 1;
    if (loc.startsWith('/history')) return 2;
    if (loc.startsWith('/profile')) return 3;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final loc = GoRouterState.of(context).uri.toString();
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _getIndex(loc),
        onTap: (i) => context.go(['/', '/earnings', '/history', '/profile'][i]),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.delivery_dining), label: 'Orders'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Earnings'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'History'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
