enum OrderStatus {
  pending, confirmed, preparing, readyForPickup,
  riderAssigned, pickedUp, inTransit, delivered, cancelled, refunded;

  String get label => switch (this) {
    pending => 'Pending',
    confirmed => 'Confirmed',
    preparing => 'Preparing',
    readyForPickup => 'Ready',
    riderAssigned => 'Rider Assigned',
    pickedUp => 'Picked Up',
    inTransit => 'On the Way',
    delivered => 'Delivered',
    cancelled => 'Cancelled',
    refunded => 'Refunded',
  };

  static OrderStatus fromString(String s) => OrderStatus.values.firstWhere(
    (e) => e.name == s || s.replaceAll('_', '') == e.name.toLowerCase(),
    orElse: () => OrderStatus.pending,
  );
}

class Order {
  final String id;
  final String orderNumber;
  final String vendorName;
  final String? vendorLogo;
  final OrderStatus status;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String paymentMethod;
  final DateTime createdAt;
  final List<OrderItemData> items;

  Order({
    required this.id,
    required this.orderNumber,
    required this.vendorName,
    this.vendorLogo,
    required this.status,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    required this.paymentMethod,
    required this.createdAt,
    this.items = const [],
  });
}

class OrderItemData {
  final String name;
  final int quantity;
  final double price;

  OrderItemData({required this.name, required this.quantity, required this.price});
}
