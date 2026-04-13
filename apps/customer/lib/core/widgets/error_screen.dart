import 'package:flutter/material.dart';
import '../../config/theme.dart';

/// Error screen — shown when something goes wrong
class ErrorScreen extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;
  final IconData icon;

  const ErrorScreen({
    super.key,
    this.message = 'Something went wrong',
    this.onRetry,
    this.icon = Icons.error_outline,
  });

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, size: 64, color: DelivraTheme.textHint),
        const SizedBox(height: 16),
        Text(message, style: const TextStyle(fontSize: 16, color: DelivraTheme.textSecondary), textAlign: TextAlign.center),
        if (onRetry != null) ...[
          const SizedBox(height: 24),
          ElevatedButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: const Text('Try Again')),
        ],
      ]),
    ),
  );
}

/// No internet screen
class NoInternetScreen extends StatelessWidget {
  final VoidCallback? onRetry;
  const NoInternetScreen({super.key, this.onRetry});

  @override
  Widget build(BuildContext context) => ErrorScreen(
    icon: Icons.wifi_off,
    message: 'No internet connection.\nPlease check your network and try again.',
    onRetry: onRetry,
  );
}

/// Empty state — shown when a list has no items
class EmptyState extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData icon;
  final Widget? action;

  const EmptyState({
    super.key,
    required this.title,
    this.subtitle,
    this.icon = Icons.inbox_outlined,
    this.action,
  });

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, size: 64, color: DelivraTheme.textHint),
        const SizedBox(height: 16),
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: DelivraTheme.textPrimary)),
        if (subtitle != null) ...[
          const SizedBox(height: 8),
          Text(subtitle!, style: const TextStyle(fontSize: 14, color: DelivraTheme.textSecondary), textAlign: TextAlign.center),
        ],
        if (action != null) ...[const SizedBox(height: 24), action!],
      ]),
    ),
  );
}

/// Predefined empty states
class EmptyOrders extends StatelessWidget {
  const EmptyOrders({super.key});
  @override
  Widget build(BuildContext context) => const EmptyState(
    icon: Icons.receipt_long_outlined,
    title: 'No orders yet',
    subtitle: 'Your order history will appear here.\nStart ordering from your favorite vendors!',
  );
}

class EmptyCart extends StatelessWidget {
  const EmptyCart({super.key});
  @override
  Widget build(BuildContext context) => const EmptyState(
    icon: Icons.shopping_cart_outlined,
    title: 'Your cart is empty',
    subtitle: 'Browse vendors and add items to get started.',
  );
}

class EmptyFavorites extends StatelessWidget {
  const EmptyFavorites({super.key});
  @override
  Widget build(BuildContext context) => const EmptyState(
    icon: Icons.favorite_border,
    title: 'No favorites yet',
    subtitle: 'Save your favorite vendors for quick access.',
  );
}

class NoVendorsNearby extends StatelessWidget {
  const NoVendorsNearby({super.key});
  @override
  Widget build(BuildContext context) => const EmptyState(
    icon: Icons.location_off,
    title: 'No vendors nearby',
    subtitle: 'We don\'t have vendors in your area yet.\nTry changing your delivery address.',
  );
}

class NoSearchResults extends StatelessWidget {
  final String query;
  const NoSearchResults({super.key, required this.query});
  @override
  Widget build(BuildContext context) => EmptyState(
    icon: Icons.search_off,
    title: 'No results for "$query"',
    subtitle: 'Try a different search term or browse categories.',
  );
}
