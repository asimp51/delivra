import 'package:go_router/go_router.dart';
import '../features/auth/presentation/screens/vendor_login_screen.dart';
import '../features/orders/presentation/screens/vendor_orders_screen.dart';
import '../features/orders/presentation/screens/vendor_shell.dart';
import '../features/menu/presentation/screens/vendor_menu_screen.dart';
import '../features/analytics/presentation/screens/vendor_analytics_screen.dart';
import '../features/reviews/presentation/screens/vendor_reviews_screen.dart';
import '../features/settings/presentation/screens/vendor_settings_screen.dart';

final vendorRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const VendorLoginScreen()),
    ShellRoute(
      builder: (_, state, child) => VendorShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (_, __) => const VendorOrdersScreen()),
        GoRoute(path: '/menu', builder: (_, __) => const VendorMenuScreen()),
        GoRoute(path: '/analytics', builder: (_, __) => const VendorAnalyticsScreen()),
        GoRoute(path: '/reviews', builder: (_, __) => const VendorReviewsScreen()),
        GoRoute(path: '/settings', builder: (_, __) => const VendorSettingsScreen()),
      ],
    ),
  ],
);
