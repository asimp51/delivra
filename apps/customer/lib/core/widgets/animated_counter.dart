import 'package:flutter/material.dart';

/// Animated number counter — used for prices, totals, earnings
/// Smoothly animates from one number to another.
///
/// Usage:
///   AnimatedCounter(value: 48.78, prefix: '\$', style: ...)
class AnimatedCounter extends StatelessWidget {
  final double value;
  final String prefix;
  final String suffix;
  final TextStyle? style;
  final int decimals;
  final Duration duration;

  const AnimatedCounter({
    super.key,
    required this.value,
    this.prefix = '',
    this.suffix = '',
    this.style,
    this.decimals = 2,
    this.duration = const Duration(milliseconds: 800),
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: value),
      duration: duration,
      curve: Curves.easeOutCubic,
      builder: (_, val, __) => Text(
        '$prefix${val.toStringAsFixed(decimals)}$suffix',
        style: style,
      ),
    );
  }
}

/// Animated slide-in widget — items slide up with fade when they appear
class SlideInWidget extends StatelessWidget {
  final Widget child;
  final int index;
  final Duration delay;

  const SlideInWidget({
    super.key,
    required this.child,
    this.index = 0,
    this.delay = const Duration(milliseconds: 100),
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: Duration(milliseconds: 400 + index * delay.inMilliseconds),
      curve: Curves.easeOutCubic,
      builder: (_, val, child) => Opacity(
        opacity: val,
        child: Transform.translate(
          offset: Offset(0, 20 * (1 - val)),
          child: child,
        ),
      ),
      child: child,
    );
  }
}

/// Pulsing dot — used for "online" status indicators
class PulsingDot extends StatefulWidget {
  final Color color;
  final double size;
  const PulsingDot({super.key, this.color = const Color(0xFF22C55E), this.size = 10});

  @override
  State<PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<PulsingDot> with SingleTickerProviderStateMixin {
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
      builder: (_, __) => Container(
        width: widget.size + 8,
        height: widget.size + 8,
        alignment: Alignment.center,
        child: Stack(alignment: Alignment.center, children: [
          Container(
            width: widget.size + 8 * _ctrl.value,
            height: widget.size + 8 * _ctrl.value,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: widget.color.withAlpha((100 * (1 - _ctrl.value)).toInt()),
            ),
          ),
          Container(
            width: widget.size,
            height: widget.size,
            decoration: BoxDecoration(shape: BoxShape.circle, color: widget.color),
          ),
        ]),
      ),
    );
  }
}
