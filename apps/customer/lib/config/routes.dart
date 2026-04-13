import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/home/presentation/screens/main_shell.dart';
import '../features/categories/presentation/screens/category_screen.dart';
import '../features/vendor_detail/presentation/screens/vendor_detail_screen.dart';
import '../features/cart/presentation/screens/cart_screen.dart';
import '../features/checkout/presentation/screens/checkout_screen.dart';
import '../features/orders/presentation/screens/orders_screen.dart';
import '../features/tracking/presentation/screens/tracking_screen.dart';
import '../features/search/presentation/screens/search_screen.dart';
import '../features/profile/presentation/screens/profile_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    ShellRoute(
      builder: (_, state, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/search', builder: (_, __) => const SearchScreen()),
        GoRoute(path: '/orders', builder: (_, __) => const OrdersScreen()),
        GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
      ],
    ),
    GoRoute(path: '/category/:slug', builder: (_, state) => CategoryScreen(slug: state.pathParameters['slug']!)),
    GoRoute(path: '/vendor/:slug', builder: (_, state) => VendorDetailScreen(slug: state.pathParameters['slug']!)),
    GoRoute(path: '/cart', builder: (_, __) => const CartScreen()),
    GoRoute(path: '/checkout', builder: (_, __) => const CheckoutScreen()),
    GoRoute(path: '/tracking/:orderId', builder: (_, state) => TrackingScreen(orderId: state.pathParameters['orderId']!)),
  ],
);
