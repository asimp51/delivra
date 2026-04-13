import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/vendor.dart';

/// Cart item with quantity and options
class CartItem {
  final VendorItem item;
  int quantity;
  final List<Map<String, dynamic>> selectedOptions;
  final String? specialInstructions;

  CartItem({
    required this.item,
    this.quantity = 1,
    this.selectedOptions = const [],
    this.specialInstructions,
  });

  double get totalPrice => item.effectivePrice * quantity;
}

/// Cart state
class CartState {
  final String? vendorId;
  final String? vendorName;
  final String? vendorSlug;
  final List<CartItem> items;
  final String? promoCode;
  final double discount;

  const CartState({
    this.vendorId,
    this.vendorName,
    this.vendorSlug,
    this.items = const [],
    this.promoCode,
    this.discount = 0,
  });

  double get subtotal => items.fold(0, (sum, i) => sum + i.totalPrice);
  double get deliveryFee => 3.00;
  double get tax => subtotal * 0.05;
  double get total => subtotal + deliveryFee + tax - discount;
  int get itemCount => items.fold(0, (sum, i) => sum + i.quantity);
  bool get isEmpty => items.isEmpty;
}

class CartNotifier extends StateNotifier<CartState> {
  CartNotifier() : super(const CartState());

  void addItem(VendorItem item, {required String vendorId, required String vendorName, String? vendorSlug}) {
    // If cart has items from different vendor, clear first
    if (state.vendorId != null && state.vendorId != vendorId) {
      state = CartState(vendorId: vendorId, vendorName: vendorName, vendorSlug: vendorSlug);
    }

    final items = List<CartItem>.from(state.items);
    final existingIndex = items.indexWhere((i) => i.item.id == item.id);

    if (existingIndex >= 0) {
      items[existingIndex].quantity++;
    } else {
      items.add(CartItem(item: item));
    }

    state = CartState(
      vendorId: vendorId,
      vendorName: vendorName,
      vendorSlug: vendorSlug,
      items: items,
      promoCode: state.promoCode,
      discount: state.discount,
    );
  }

  void removeItem(String itemId) {
    final items = state.items.where((i) => i.item.id != itemId).toList();
    if (items.isEmpty) {
      state = const CartState();
    } else {
      state = CartState(
        vendorId: state.vendorId,
        vendorName: state.vendorName,
        vendorSlug: state.vendorSlug,
        items: items,
        promoCode: state.promoCode,
        discount: state.discount,
      );
    }
  }

  void updateQuantity(String itemId, int quantity) {
    if (quantity <= 0) return removeItem(itemId);
    final items = List<CartItem>.from(state.items);
    final index = items.indexWhere((i) => i.item.id == itemId);
    if (index >= 0) {
      items[index].quantity = quantity;
      state = CartState(
        vendorId: state.vendorId,
        vendorName: state.vendorName,
        vendorSlug: state.vendorSlug,
        items: items,
        promoCode: state.promoCode,
        discount: state.discount,
      );
    }
  }

  void applyPromo(String code, double discount) {
    state = CartState(
      vendorId: state.vendorId,
      vendorName: state.vendorName,
      vendorSlug: state.vendorSlug,
      items: state.items,
      promoCode: code,
      discount: discount,
    );
  }

  void clearCart() {
    state = const CartState();
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) => CartNotifier());
