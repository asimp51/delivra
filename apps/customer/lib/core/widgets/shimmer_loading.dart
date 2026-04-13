import 'package:flutter/material.dart';

/// Shimmer loading placeholder used across the app
/// while data is being fetched from the API.
///
/// Usage:
///   ShimmerLoading(child: Container(height: 200, decoration: ...))
///
/// Shows a gradient animation sweeping left to right.
class ShimmerLoading extends StatefulWidget {
  final Widget child;
  const ShimmerLoading({super.key, required this.child});

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500))..repeat();
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (_, child) => ShaderMask(
        shaderCallback: (bounds) => LinearGradient(
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
          colors: const [Color(0xFFE2E8F0), Color(0xFFF1F5F9), Color(0xFFE2E8F0)],
          stops: [_ctrl.value - 0.3, _ctrl.value, _ctrl.value + 0.3],
        ).createShader(bounds),
        blendMode: BlendMode.srcATop,
        child: child,
      ),
      child: widget.child,
    );
  }
}

/// Predefined shimmer placeholders for common UI patterns
class ShimmerVendorCard extends StatelessWidget {
  const ShimmerVendorCard({super.key});
  @override
  Widget build(BuildContext context) => ShimmerLoading(
    child: Container(
      width: 180, height: 200,
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(children: [
        Container(height: 110, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.vertical(top: Radius.circular(16)))),
        Padding(padding: const EdgeInsets.all(12), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(height: 14, width: 120, color: const Color(0xFFE2E8F0)),
          const SizedBox(height: 8),
          Container(height: 10, width: 80, color: const Color(0xFFE2E8F0)),
        ])),
      ]),
    ),
  );
}

class ShimmerListTile extends StatelessWidget {
  const ShimmerListTile({super.key});
  @override
  Widget build(BuildContext context) => ShimmerLoading(
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(children: [
        Container(width: 64, height: 64, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(12))),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(height: 14, width: 160, color: const Color(0xFFE2E8F0)),
          const SizedBox(height: 8),
          Container(height: 10, width: 100, color: const Color(0xFFE2E8F0)),
          const SizedBox(height: 8),
          Container(height: 12, width: 60, color: const Color(0xFFE2E8F0)),
        ])),
      ]),
    ),
  );
}
