import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class _VendorOrder {
  final String id, customer, payment;
  final List<String> items;
  final double total;
  final String elapsed;
  final String status; // incoming, preparing, ready
  _VendorOrder({required this.id, required this.customer, required this.items, required this.total, required this.elapsed, required this.payment, required this.status});
}

class VendorOrdersScreen extends StatefulWidget {
  const VendorOrdersScreen({super.key});
  @override
  State<VendorOrdersScreen> createState() => _VendorOrdersScreenState();
}

class _VendorOrdersScreenState extends State<VendorOrdersScreen> with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  bool _isOpen = true;

  final _orders = [
    _VendorOrder(id: 'DLV-K2M8', customer: 'Ahmed Khan', items: ['2x Chicken Meal (Spicy)', '1x Garlic Bread'], total: 45.50, elapsed: '2 min', payment: 'Card', status: 'incoming'),
    _VendorOrder(id: 'DLV-L9N3', customer: 'Sarah Ali', items: ['1x Family Bucket', '2x Pepsi'], total: 78.00, elapsed: '4 min', payment: 'Cash', status: 'incoming'),
    _VendorOrder(id: 'DLV-M4P7', customer: 'Omar Hassan', items: ['3x Broasted Combo', '3x Fries'], total: 62.00, elapsed: '14 min', payment: 'Card', status: 'preparing'),
    _VendorOrder(id: 'DLV-N1Q5', customer: 'Fatima Noor', items: ['1x Nuggets Box', '2x Cheese Burger'], total: 38.50, elapsed: '19 min', payment: 'Wallet', status: 'preparing'),
    _VendorOrder(id: 'DLV-O8R2', customer: 'Khalid Saeed', items: ['1x Shrimp Meal'], total: 29.00, elapsed: '29 min', payment: 'Card', status: 'ready'),
  ];

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 3, vsync: this);
  }
  @override
  void dispose() { _tabCtrl.dispose(); super.dispose(); }

  List<_VendorOrder> _getOrders(String status) => _orders.where((o) => o.status == status).toList();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Al Baik Restaurant', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          Row(children: [
            Container(width: 8, height: 8, decoration: BoxDecoration(shape: BoxShape.circle, color: _isOpen ? VendorTheme.success : VendorTheme.error)),
            const SizedBox(width: 4),
            Text(_isOpen ? 'Open' : 'Closed', style: TextStyle(fontSize: 12, color: _isOpen ? VendorTheme.success : VendorTheme.error, fontWeight: FontWeight.w600)),
          ]),
        ]),
        actions: [
          Switch(value: _isOpen, onChanged: (v) => setState(() => _isOpen = v), activeColor: VendorTheme.success),
        ],
        bottom: TabBar(
          controller: _tabCtrl,
          labelColor: VendorTheme.primary,
          unselectedLabelColor: VendorTheme.textHint,
          indicatorColor: VendorTheme.primary,
          tabs: [
            Tab(child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Text('Incoming'),
              const SizedBox(width: 6),
              Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1), decoration: BoxDecoration(color: VendorTheme.incoming, borderRadius: BorderRadius.circular(99)),
                child: Text('${_getOrders('incoming').length}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
            ])),
            Tab(child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Text('Preparing'),
              const SizedBox(width: 6),
              Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1), decoration: BoxDecoration(color: VendorTheme.preparing, borderRadius: BorderRadius.circular(99)),
                child: Text('${_getOrders('preparing').length}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
            ])),
            Tab(child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Text('Ready'),
              const SizedBox(width: 6),
              Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1), decoration: BoxDecoration(color: VendorTheme.ready, borderRadius: BorderRadius.circular(99)),
                child: Text('${_getOrders('ready').length}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
            ])),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabCtrl,
        children: [
          _OrderList(orders: _getOrders('incoming'), column: 'incoming'),
          _OrderList(orders: _getOrders('preparing'), column: 'preparing'),
          _OrderList(orders: _getOrders('ready'), column: 'ready'),
        ],
      ),
    );
  }
}

class _OrderList extends StatelessWidget {
  final List<_VendorOrder> orders;
  final String column;
  const _OrderList({required this.orders, required this.column});

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(Icons.receipt_long_outlined, size: 48, color: VendorTheme.textHint),
        const SizedBox(height: 12),
        Text('No $column orders', style: const TextStyle(color: VendorTheme.textSecondary)),
      ]));
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemCount: orders.length,
      itemBuilder: (_, i) {
        final o = orders[i];
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: VendorTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(o.id, style: const TextStyle(fontWeight: FontWeight.w700, color: VendorTheme.primary, fontSize: 14)),
              Row(children: [const Icon(Icons.access_time, size: 14, color: VendorTheme.textHint), const SizedBox(width: 4), Text(o.elapsed, style: const TextStyle(fontSize: 12, color: VendorTheme.textHint))]),
            ]),
            const SizedBox(height: 10),
            Row(children: [
              Container(width: 36, height: 36, decoration: BoxDecoration(color: VendorTheme.border, shape: BoxShape.circle),
                child: Center(child: Text(o.customer.split(' ').map((n) => n[0]).join(''), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: VendorTheme.textSecondary)))),
              const SizedBox(width: 10),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(o.customer, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                Text(o.payment, style: const TextStyle(fontSize: 12, color: VendorTheme.textHint)),
              ]),
            ]),
            const Divider(height: 20),
            ...o.items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Text(item, style: const TextStyle(fontSize: 13, color: VendorTheme.textPrimary)),
            )),
            const SizedBox(height: 10),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('\$${o.total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
              if (column == 'incoming') Row(children: [
                OutlinedButton(onPressed: () {}, style: OutlinedButton.styleFrom(foregroundColor: VendorTheme.error, side: const BorderSide(color: VendorTheme.error), padding: const EdgeInsets.symmetric(horizontal: 16)), child: const Text('Reject')),
                const SizedBox(width: 8),
                ElevatedButton(onPressed: () {}, child: const Text('Accept')),
              ]),
              if (column == 'preparing')
                ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.check, size: 18), label: const Text('Mark Ready'), style: ElevatedButton.styleFrom(backgroundColor: VendorTheme.warning)),
              if (column == 'ready')
                Container(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10), decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(10)),
                  child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.delivery_dining, color: VendorTheme.primary, size: 18), SizedBox(width: 6), Text('Awaiting Rider', style: TextStyle(color: VendorTheme.primary, fontWeight: FontWeight.w600))])),
            ]),
          ]),
        );
      },
    );
  }
}
