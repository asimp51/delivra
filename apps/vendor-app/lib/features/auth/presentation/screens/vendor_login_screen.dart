import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';

class VendorLoginScreen extends StatefulWidget {
  const VendorLoginScreen({super.key});
  @override
  State<VendorLoginScreen> createState() => _VendorLoginScreenState();
}

class _VendorLoginScreenState extends State<VendorLoginScreen> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [VendorTheme.primary, Color(0xFF047857)]),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(children: [
                Container(
                  width: 80, height: 80,
                  decoration: BoxDecoration(color: Colors.white.withAlpha(51), borderRadius: BorderRadius.circular(24)),
                  child: const Icon(Icons.store, size: 44, color: Colors.white),
                ),
                const SizedBox(height: 16),
                const Text('Delivra', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: Colors.white)),
                Text('Vendor Portal', style: TextStyle(fontSize: 14, color: Colors.white.withAlpha(179))),
                const SizedBox(height: 48),
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                    const Text('Sign In to Your Store', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 24),
                    const TextField(decoration: InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined))),
                    const SizedBox(height: 16),
                    TextField(
                      obscureText: _obscure,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility), onPressed: () => setState(() => _obscure = !_obscure)),
                      ),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(onPressed: () => context.go('/'), child: const Text('Sign In')),
                    const SizedBox(height: 16),
                    const Text('Register your restaurant on Delivra', textAlign: TextAlign.center, style: TextStyle(color: VendorTheme.textSecondary, fontSize: 13)),
                  ]),
                ),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}
