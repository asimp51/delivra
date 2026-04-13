import 'package:flutter/material.dart';
import '../../../../config/theme.dart';

class TrackingScreen extends StatelessWidget {
  final String orderId;
  const TrackingScreen({super.key, required this.orderId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Order Tracking'), backgroundColor: Colors.white, foregroundColor: DelivraTheme.textPrimary, elevation: 0.5),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Animated status area
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(20)),
              child: Column(children: [
                const _CookingAnimation(),
                const SizedBox(height: 16),
                const Text('Preparing Your Order', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                const Text('The chef is cooking your meal', style: TextStyle(color: DelivraTheme.textSecondary)),
              ]),
            ),
            const SizedBox(height: 20),
            // ETA
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: DelivraTheme.primary, width: 2)),
              child: const Row(children: [
                Text('25', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: DelivraTheme.primary)),
                SizedBox(width: 4),
                Text('min', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: DelivraTheme.primary)),
                SizedBox(width: 16),
                Text('Estimated delivery time', style: TextStyle(color: DelivraTheme.textSecondary)),
              ]),
            ),
            const SizedBox(height: 24),
            // Timeline
            ...List.generate(5, (i) {
              final steps = ['Order Confirmed', 'Preparing', 'Ready for Pickup', 'On the Way', 'Delivered'];
              final isCompleted = i < 1;
              final isActive = i == 1;
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(children: [
                    Container(
                      width: 32, height: 32,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isCompleted || isActive ? DelivraTheme.primary : DelivraTheme.border,
                      ),
                      child: Icon(
                        isCompleted ? Icons.check : (isActive ? Icons.circle : Icons.circle_outlined),
                        color: isCompleted || isActive ? Colors.white : DelivraTheme.textHint,
                        size: isActive ? 12 : 16,
                      ),
                    ),
                    if (i < 4) Container(width: 2, height: 40, color: isCompleted ? DelivraTheme.primary : DelivraTheme.border),
                  ]),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(steps[i], style: TextStyle(fontWeight: FontWeight.w600, color: isCompleted || isActive ? DelivraTheme.textPrimary : DelivraTheme.textHint)),
                        Text(isCompleted ? 'Completed' : isActive ? 'In progress...' : '', style: TextStyle(fontSize: 12, color: isActive ? DelivraTheme.primary : DelivraTheme.textHint)),
                        const SizedBox(height: 20),
                      ]),
                    ),
                  ),
                ],
              );
            }),
            const SizedBox(height: 16),
            // Order summary
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: DelivraTheme.border)),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Order $orderId', style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                const Text('Al Baik', style: TextStyle(color: DelivraTheme.textSecondary)),
                const Divider(),
                ...[('2x Chicken Meal', '\$36.00'), ('1x Garlic Bread', '\$6.50'), ('1x Pepsi 1L', '\$3.00')].map((item) =>
                  Padding(padding: const EdgeInsets.symmetric(vertical: 2), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text(item.$1, style: const TextStyle(fontSize: 13)), Text(item.$2, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  ]))),
                const Divider(),
                const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text('Total', style: TextStyle(fontWeight: FontWeight.w700)),
                  Text('\$48.78', style: TextStyle(fontWeight: FontWeight.w800, color: DelivraTheme.primary, fontSize: 16)),
                ]),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}

class _CookingAnimation extends StatefulWidget {
  const _CookingAnimation();
  @override
  State<_CookingAnimation> createState() => _CookingAnimationState();
}

class _CookingAnimationState extends State<_CookingAnimation> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
  }
  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (_, __) => SizedBox(
        width: 120, height: 120,
        child: CustomPaint(painter: _CookingPainter(_ctrl.value)),
      ),
    );
  }
}

class _CookingPainter extends CustomPainter {
  final double t;
  _CookingPainter(this.t);

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;

    // Pan
    final panPaint = Paint()..color = DelivraTheme.primary;
    canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 15), width: 90, height: 24), panPaint);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 5), width: 80, height: 50), Paint()..color = DelivraTheme.primaryLight);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy), width: 70, height: 40), Paint()..color = const Color(0xFFFBBF24));

    // Handle
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(cx + 38, cy + 8, 30, 8), const Radius.circular(4)), panPaint);

    // Steam
    final steamPaint = Paint()..color = Colors.grey.withAlpha(100)..style = PaintingStyle.stroke..strokeWidth = 2.5..strokeCap = StrokeCap.round;
    for (var i = 0; i < 3; i++) {
      final x = cx - 20 + i * 20;
      final offset = ((t + i * 0.3) % 1.0);
      final y = cy - 15 - offset * 30;
      final path = Path()..moveTo(x.toDouble(), cy - 10)..quadraticBezierTo(x + 5, y + 10, x.toDouble(), y);
      canvas.drawPath(path, steamPaint..color = Colors.grey.withAlpha((100 * (1 - offset)).toInt()));
    }

    // Fire
    final firePaint = Paint()..color = const Color(0xFFF97316);
    for (var i = 0; i < 3; i++) {
      final x = cx - 15 + i * 15;
      final flicker = 8 + 6 * ((t * 3 + i).remainder(1));
      canvas.drawOval(Rect.fromCenter(center: Offset(x.toDouble(), cy + 30), width: 10, height: flicker), firePaint);
    }
  }

  @override
  bool shouldRepaint(covariant _CookingPainter old) => old.t != t;
}
