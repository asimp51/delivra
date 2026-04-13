import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/home/presentation/screens/rider_home_screen.dart';
import '../features/home/presentation/screens/rider_shell.dart';
import '../features/active_delivery/presentation/screens/active_delivery_screen.dart';
import '../features/earnings/presentation/screens/earnings_screen.dart';
import '../features/history/presentation/screens/history_screen.dart';
import '../features/profile/presentation/screens/rider_profile_screen.dart';

final riderRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (_, state, child) => RiderShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const RiderHomeScreen()),
        GoRoute(path: '/earnings', builder: (_, __) => const EarningsScreen()),
        GoRoute(path: '/history', builder: (_, __) => const HistoryScreen()),
        GoRoute(path: '/profile', builder: (_, __) => const RiderProfileScreen()),
      ],
    ),
    GoRoute(path: '/delivery/:orderId', builder: (_, state) => ActiveDeliveryScreen(orderId: state.pathParameters['orderId']!)),
  ],
);
