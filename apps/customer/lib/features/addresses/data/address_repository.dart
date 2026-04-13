import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';

class Address {
  final String id;
  final String label;
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final double latitude;
  final double longitude;
  final bool isDefault;

  Address({
    required this.id,
    required this.label,
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    required this.latitude,
    required this.longitude,
    this.isDefault = false,
  });

  factory Address.fromJson(Map<String, dynamic> json) => Address(
    id: json['id'],
    label: json['label'] ?? 'Home',
    addressLine1: json['address_line_1'],
    addressLine2: json['address_line_2'],
    city: json['city'],
    latitude: double.tryParse('${json['latitude']}') ?? 0,
    longitude: double.tryParse('${json['longitude']}') ?? 0,
    isDefault: json['is_default'] ?? false,
  );

  String get fullAddress => [addressLine1, addressLine2, city].where((s) => s != null && s.isNotEmpty).join(', ');
}

class AddressState {
  final List<Address> addresses;
  final Address? selected;
  final bool isLoading;

  const AddressState({this.addresses = const [], this.selected, this.isLoading = false});
}

class AddressNotifier extends StateNotifier<AddressState> {
  final ApiClient _api = ApiClient();

  AddressNotifier() : super(const AddressState());

  Future<void> loadAddresses() async {
    state = AddressState(isLoading: true, addresses: state.addresses, selected: state.selected);
    try {
      final res = await _api.get('/auth/me');
      final List addrs = res.data['data']['addresses'] ?? [];
      final addresses = addrs.map((a) => Address.fromJson(a)).toList();
      final defaultAddr = addresses.firstWhere((a) => a.isDefault, orElse: () => addresses.first);
      state = AddressState(addresses: addresses, selected: state.selected ?? defaultAddr);
    } catch (_) {
      state = AddressState(addresses: state.addresses, selected: state.selected);
    }
  }

  Future<bool> addAddress({
    required String label,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required double latitude,
    required double longitude,
    bool isDefault = false,
  }) async {
    try {
      await _api.post('/addresses', data: {
        'label': label,
        'address_line_1': addressLine1,
        'address_line_2': addressLine2,
        'city': city,
        'latitude': latitude,
        'longitude': longitude,
        'is_default': isDefault,
      });
      await loadAddresses();
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteAddress(String id) async {
    try {
      await _api.delete('/addresses/$id');
      await loadAddresses();
      return true;
    } catch (_) {
      return false;
    }
  }

  void selectAddress(Address address) {
    state = AddressState(addresses: state.addresses, selected: address);
  }
}

final addressProvider = StateNotifierProvider<AddressNotifier, AddressState>((ref) => AddressNotifier());
