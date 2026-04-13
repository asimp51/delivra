import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../config/theme.dart';

/// Animated order status icons used in tracking_screen.dart and orders_screen.dart
/// Each status has a unique animation:
/// - Confirmed: Bouncing bag with checkmark
/// - Preparing: Cooking pan with steam and fire
/// - Ready: Ringing bell
/// - Picked Up: Bouncing motorcycle
/// - In Transit: Moving dot on path
/// - Delivered: Expanding checkmark with confetti

class AnimatedStatusIcon extends StatefulWidget {
  final String status;
  final double size;
  const AnimatedStatusIcon({super.key, required this.status, this.size = 120});

  @override
  State<AnimatedStatusIcon> createState() => _AnimatedStatusIconState();
}

class _AnimatedStatusIconState extends State<AnimatedStatusIcon> with TickerProviderStateMixin {
  late AnimationController _mainCtrl;
  late AnimationController _secondaryCtrl;

  @override
  void initState() {
    super.initState();
    _mainCtrl = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
    _secondaryCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500))..repeat(reverse: true);
  }

  @override
  void dispose() {
    _mainCtrl.dispose();
    _secondaryCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: Listenable.merge([_mainCtrl, _secondaryCtrl]),
        builder: (_, __) => CustomPaint(
          painter: _StatusPainter(
            status: widget.status,
            mainProgress: _mainCtrl.value,
            secondaryProgress: _secondaryCtrl.value,
          ),
        ),
      ),
    );
  }
}

class _StatusPainter extends CustomPainter {
  final String status;
  final double mainProgress;
  final double secondaryProgress;

  _StatusPainter({required this.status, required this.mainProgress, required this.secondaryProgress});

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;

    switch (status) {
      case 'pending':
      case 'confirmed':
        _paintConfirmed(canvas, cx, cy);
      case 'preparing':
        _paintCooking(canvas, cx, cy);
      case 'ready_for_pickup':
        _paintReady(canvas, cx, cy);
      case 'rider_assigned':
      case 'picked_up':
        _paintPickedUp(canvas, cx, cy);
      case 'in_transit':
        _paintInTransit(canvas, cx, cy, size);
      case 'delivered':
        _paintDelivered(canvas, cx, cy);
      default:
        _paintConfirmed(canvas, cx, cy);
    }
  }

  void _paintConfirmed(Canvas canvas, double cx, double cy) {
    // Bouncing bag
    final bounce = math.sin(mainProgress * math.pi * 2) * 5;
    canvas.drawCircle(Offset(cx, cy), 45, Paint()..color = const Color(0xFFECFDF5));
    canvas.drawCircle(Offset(cx, cy), 45, Paint()..color = DelivraTheme.primary..style = PaintingStyle.stroke..strokeWidth = 2.5);

    // Bag body
    final bagTop = cy - 10 + bounce;
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, bagTop + 12), width: 36, height: 30), const Radius.circular(4)),
      Paint()..color = DelivraTheme.primary,
    );
    // Bag handle
    final handlePath = Path()
      ..moveTo(cx - 10, bagTop + 2)..lineTo(cx - 10, bagTop - 8)
      ..quadraticBezierTo(cx, bagTop - 18, cx + 10, bagTop - 8)..lineTo(cx + 10, bagTop + 2);
    canvas.drawPath(handlePath, Paint()..color = DelivraTheme.primary..style = PaintingStyle.stroke..strokeWidth = 2.5);

    // Checkmark
    final checkPath = Path()..moveTo(cx - 8, bagTop + 12)..lineTo(cx - 2, bagTop + 18)..lineTo(cx + 10, bagTop + 6);
    canvas.drawPath(checkPath, Paint()..color = Colors.white..style = PaintingStyle.stroke..strokeWidth = 3..strokeCap = StrokeCap.round..strokeJoin = StrokeJoin.round);
  }

  void _paintCooking(Canvas canvas, double cx, double cy) {
    final shake = math.sin(mainProgress * math.pi * 6) * 2;

    // Pan
    canvas.drawOval(Rect.fromCenter(center: Offset(cx + shake, cy + 12), width: 70, height: 18), Paint()..color = DelivraTheme.primary);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx + shake, cy + 4), width: 62, height: 36), Paint()..color = DelivraTheme.primaryLight);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx + shake, cy), width: 54, height: 28), Paint()..color = const Color(0xFFFBBF24));
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(cx + 30 + shake, cy + 6, 24, 6), const Radius.circular(3)),
      Paint()..color = DelivraTheme.primary,
    );

    // Steam
    for (var i = 0; i < 3; i++) {
      final x = cx - 14.0 + i * 14;
      final offset = ((mainProgress + i * 0.3) % 1.0);
      final steamPaint = Paint()..color = Colors.grey.withAlpha((80 * (1 - offset)).toInt())..style = PaintingStyle.stroke..strokeWidth = 2..strokeCap = StrokeCap.round;
      final path = Path()..moveTo(x, cy - 10)..quadraticBezierTo(x + 4, cy - 18 - offset * 20, x, cy - 26 - offset * 20);
      canvas.drawPath(path, steamPaint);
    }

    // Fire
    for (var i = 0; i < 3; i++) {
      final x = cx - 12.0 + i * 12;
      final flicker = 6 + 4 * math.sin(mainProgress * math.pi * 4 + i);
      canvas.drawOval(Rect.fromCenter(center: Offset(x, cy + 24), width: 8, height: flicker), Paint()..color = const Color(0xFFF97316));
    }
  }

  void _paintReady(Canvas canvas, double cx, double cy) {
    // Bell ring
    final ring = math.sin(mainProgress * math.pi * 4) * 8;
    canvas.drawCircle(Offset(cx, cy), 45, Paint()..color = const Color(0xFFECFDF5));
    canvas.save();
    canvas.translate(cx, cy - 10);
    canvas.rotate(ring * math.pi / 180);
    canvas.translate(-cx, -(cy - 10));

    // Bell body
    final bellPath = Path()
      ..moveTo(cx - 18, cy + 8)
      ..quadraticBezierTo(cx - 18, cy - 18, cx, cy - 22)
      ..quadraticBezierTo(cx + 18, cy - 18, cx + 18, cy + 8)
      ..close();
    canvas.drawPath(bellPath, Paint()..color = DelivraTheme.primary);
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy + 10), width: 40, height: 5), const Radius.circular(3)), Paint()..color = DelivraTheme.primary);
    canvas.restore();
    canvas.drawCircle(Offset(cx, cy + 18), 4, Paint()..color = DelivraTheme.primary);
  }

  void _paintPickedUp(Canvas canvas, double cx, double cy) {
    final bounce = math.sin(mainProgress * math.pi * 3) * 6;

    // Rider body
    canvas.drawCircle(Offset(cx - 4, cy - 18 + bounce), 10, Paint()..color = DelivraTheme.primary);
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx - 4, cy - 2 + bounce), width: 14, height: 20), const Radius.circular(3)),
      Paint()..color = DelivraTheme.primary,
    );

    // Bag on back
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(cx + 4, cy - 10 + bounce, 16, 18), const Radius.circular(3)),
      Paint()..color = DelivraTheme.primaryLight,
    );

    // Wheels
    final wheelPaint = Paint()..color = DelivraTheme.primary..style = PaintingStyle.stroke..strokeWidth = 2.5;
    canvas.drawCircle(Offset(cx - 20, cy + 20), 14, wheelPaint);
    canvas.drawCircle(Offset(cx + 20, cy + 20), 14, wheelPaint);

    // Road
    final roadPaint = Paint()..color = const Color(0xFFE2E8F0)..style = PaintingStyle.stroke..strokeWidth = 2..strokeCap = StrokeCap.round;
    for (var i = 0; i < 5; i++) {
      final dashX = (cx - 40 + i * 20 + mainProgress * 20) % (cx + 40) - 20;
      canvas.drawLine(Offset(dashX, cy + 38), Offset(dashX + 8, cy + 38), roadPaint);
    }
  }

  void _paintInTransit(Canvas canvas, double cx, double cy, Size size) {
    // Map background
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy), width: size.width * 0.8, height: size.height * 0.7), const Radius.circular(12)),
      Paint()..color = const Color(0xFFECFDF5),
    );

    // Route path
    final routePath = Path()
      ..moveTo(cx - 30, cy - 20)
      ..quadraticBezierTo(cx, cy - 10, cx + 10, cy + 5)
      ..quadraticBezierTo(cx + 20, cy + 15, cx + 30, cy + 20);
    canvas.drawPath(routePath, Paint()..color = DelivraTheme.primary..style = PaintingStyle.stroke..strokeWidth = 3..strokeCap = StrokeCap.round);

    // Moving dot
    final pathMetrics = routePath.computeMetrics().first;
    final tangent = pathMetrics.getTangentForOffset(pathMetrics.length * mainProgress);
    if (tangent != null) {
      canvas.drawCircle(tangent.position, 8, Paint()..color = DelivraTheme.primary);
      canvas.drawCircle(tangent.position, 16, Paint()..color = DelivraTheme.primary.withAlpha((60 * secondaryProgress).toInt()));
    }

    // Destination pin
    canvas.drawCircle(Offset(cx + 30, cy + 16), 6, Paint()..color = Colors.red);
  }

  void _paintDelivered(Canvas canvas, double cx, double cy) {
    // Circle
    canvas.drawCircle(Offset(cx, cy), 45, Paint()..color = const Color(0xFFECFDF5));
    canvas.drawCircle(Offset(cx, cy), 45, Paint()..color = DelivraTheme.primary..style = PaintingStyle.stroke..strokeWidth = 3);

    // Animated checkmark
    final checkLength = mainProgress.clamp(0.0, 0.5) * 2;
    final checkPath = Path()..moveTo(cx - 16, cy)..lineTo(cx - 4, cy + 12)..lineTo(cx + 18, cy - 12);
    final checkMetrics = checkPath.computeMetrics().first;
    final drawPath = checkMetrics.extractPath(0, checkMetrics.length * checkLength);
    canvas.drawPath(drawPath, Paint()..color = DelivraTheme.primary..style = PaintingStyle.stroke..strokeWidth = 5..strokeCap = StrokeCap.round..strokeJoin = StrokeJoin.round);

    // Confetti particles
    if (mainProgress > 0.5) {
      final confettiProgress = (mainProgress - 0.5) * 2;
      final colors = [Colors.red, Colors.blue, Colors.amber, Colors.purple, Colors.pink, DelivraTheme.primary];
      for (var i = 0; i < 8; i++) {
        final angle = (i / 8) * math.pi * 2 + confettiProgress * 2;
        final radius = 35 + confettiProgress * 25;
        final x = cx + math.cos(angle) * radius;
        final y = cy + math.sin(angle) * radius;
        canvas.drawCircle(Offset(x, y), 3, Paint()..color = colors[i % colors.length].withAlpha((255 * (1 - confettiProgress)).toInt()));
      }
    }
  }

  @override
  bool shouldRepaint(covariant _StatusPainter old) => old.mainProgress != mainProgress || old.secondaryProgress != secondaryProgress;
}
