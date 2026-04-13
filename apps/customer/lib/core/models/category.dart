class Category {
  final String id;
  final String? parentId;
  final String name;
  final String slug;
  final String? iconUrl;
  final String? imageUrl;
  final bool isActive;
  final Map<String, dynamic> metadata;
  final List<Category> children;

  Category({
    required this.id,
    this.parentId,
    required this.name,
    required this.slug,
    this.iconUrl,
    this.imageUrl,
    this.isActive = true,
    this.metadata = const {},
    this.children = const [],
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
    id: json['id'],
    parentId: json['parent_id'],
    name: json['name'],
    slug: json['slug'],
    iconUrl: json['icon_url'],
    imageUrl: json['image_url'],
    isActive: json['is_active'] ?? true,
    metadata: json['metadata'] ?? {},
    children: (json['children'] as List?)?.map((c) => Category.fromJson(c)).toList() ?? [],
  );
}
