import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';
import '../../../../core/widgets/error_screen.dart';
import '../../../../core/widgets/shimmer_loading.dart';
import '../../data/order_repository.dart';

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});
  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(ordersProvider.notifier).loadOrders());
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(ordersProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My Orders'), backgroundColor: Colors.white, foregroundColor: DelivraTheme.textPrimary, elevation: 0.5),
      body: state.isLoading
          ? ListView(children: List.generate(4, (_) => const Padding(padding: EdgeInsets.all(16), child: ShimmerListTile())))
          : state.error != null
              ? ErrorScreen(message: state.error!, onRetry: () => ref.read(ordersProvider.notifier).loadOrders())
              : state.orders.isEmpty
                  ? const EmptyOrders()
                  : RefreshIndicator(
                      color: DelivraTheme.primary,
                      onRefresh: () => ref.read(ordersProvider.notifier).loadOrders(),
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: state.orders.length,
                        itemBuilder: (_, i) {
                          final o = state.orders[i];
                          final status = o['status'] ?? 'pending';
                          final isActive = !['delivered', 'cancelled', 'refunded'].contains(status);

                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: DelivraTheme.border)),
                            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                Text(o['order_number'] ?? '', style: const TextStyle(fontWeight: FontWeight.w700, color: DelivraTheme.primary)),
                                _StatusBadge(status: status),
                              ]),
                              const SizedBox(height: 8),
                              Text(o['vendor']?['name'] ?? '', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                              const SizedBox(height: 4),
                              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                Text('${(o['items'] as List?)?.length ?? 0} items', style: const TextStyle(fontSize: 13, color: DelivraTheme.textHint)),
                                Text('\$${double.tryParse('${o['total']}')?.toStringAsFixed(2) ?? '0.00'}',
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: DelivraTheme.primary)),
                              ]),
                              if (isActive) ...[
                                const SizedBox(height: 12),
                                GestureDetector(
                                  onTap: () => context.push('/tracking/${o['id']}'),
                                  child: Container(
                                    width: double.infinity, padding: const EdgeInsets.symmetric(vertical: 10),
                                    decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(10)),
                                    child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                      Icon(Icons.location_on, color: DelivraTheme.primary, size: 18), SizedBox(width: 4),
                                      Text('Track Order', style: TextStyle(color: DelivraTheme.primary, fontWeight: FontWeight.w600)),
                                    ]),
                                  ),
                                ),
                              ],
                            ]),
                          );
                        },
                      ),
                    ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  Color get _color => switch (status) {
    'delivered' => DelivraTheme.success,
    'cancelled' || 'refunded' => DelivraTheme.error,
    'preparing' => const Color(0xFFF59E0B),
    'in_transit' || 'picked_up' => DelivraTheme.primary,
    _ => DelivraTheme.textHint,
  };

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
    decoration: BoxDecoration(color: _color.withAlpha(25), borderRadius: BorderRadius.circular(99)),
    child: Text(status.replaceAll('_', ' '), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _color)),
  );
}
