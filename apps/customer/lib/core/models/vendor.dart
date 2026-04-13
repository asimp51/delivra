class Vendor {
  final String id;
  final String name;
  final String slug;
  final String? description;
  final String? logoUrl;
  final String? coverImageUrl;
  final String categoryName;
  final double avgRating;
  final int totalRatings;
  final double minOrderAmount;
  final double deliveryFee;
  final int? avgPrepTimeMin;
  final bool isOpen;
  final List<VendorItem> items;

  Vendor({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.logoUrl,
    this.coverImageUrl,
    required this.categoryName,
    this.avgRating = 0,
    this.totalRatings = 0,
    this.minOrderAmount = 0,
    this.deliveryFee = 0,
    this.avgPrepTimeMin,
    this.isOpen = true,
    this.items = const [],
  });

  factory Vendor.fromJson(Map<String, dynamic> json) => Vendor(
    id: json['id'],
    name: json['name'],
    slug: json['slug'],
    description: json['description'],
    logoUrl: json['logo_url'],
    coverImageUrl: json['cover_image_url'],
    categoryName: json['category']?['name'] ?? '',
    avgRating: double.tryParse('${json['avg_rating']}') ?? 0,
    totalRatings: json['total_ratings'] ?? 0,
    minOrderAmount: double.tryParse('${json['min_order_amount']}') ?? 0,
    deliveryFee: double.tryParse('${json['delivery_fee']}') ?? 0,
    avgPrepTimeMin: json['avg_prep_time_min'],
    isOpen: json['is_open'] ?? true,
    items: (json['items'] as List?)?.map((i) => VendorItem.fromJson(i)).toList() ?? [],
  );
}

class VendorItem {
  final String id;
  final String name;
  final String? description;
  final double price;
  final double? discountedPrice;
  final String? imageUrl;
  final bool isAvailable;
  final String? subcategoryName;

  VendorItem({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.discountedPrice,
    this.imageUrl,
    this.isAvailable = true,
    this.subcategoryName,
  });

  double get effectivePrice => discountedPrice ?? price;

  factory VendorItem.fromJson(Map<String, dynamic> json) => VendorItem(
    id: json['id'],
    name: json['name'],
    description: json['description'],
    price: double.tryParse('${json['price']}') ?? 0,
    discountedPrice: json['discounted_price'] != null ? double.tryParse('${json['discounted_price']}') : null,
    imageUrl: json['image_url'],
    isAvailable: json['is_available'] ?? true,
    subcategoryName: json['subcategory']?['name'],
  );
}
