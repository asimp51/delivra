import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';
import '../../../../core/widgets/form_validators.dart';
import '../../data/auth_repository.dart';
import 'register_screen.dart';
import 'forgot_password_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});
  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscure = true;

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    final success = await ref.read(authProvider.notifier).login(_emailCtrl.text.trim(), _passwordCtrl.text);
    if (success && mounted) context.go('/');
  }

  @override
  void dispose() { _emailCtrl.dispose(); _passwordCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [DelivraTheme.primary, DelivraTheme.primaryDark])),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(children: [
                Container(width: 80, height: 80, decoration: BoxDecoration(color: Colors.white.withAlpha(51), borderRadius: BorderRadius.circular(24)),
                  child: const Icon(Icons.local_shipping_rounded, size: 44, color: Colors.white)),
                const SizedBox(height: 16),
                const Text('Delivra', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: Colors.white)),
                Text('Everything delivered', style: TextStyle(fontSize: 14, color: Colors.white.withAlpha(179))),
                const SizedBox(height: 48),
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
                  child: Form(
                    key: _formKey,
                    child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                      const Text('Welcome back', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 24),
                      if (auth.error != null) ...[
                        Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: DelivraTheme.error.withAlpha(25), borderRadius: BorderRadius.circular(10)),
                          child: Row(children: [const Icon(Icons.error_outline, color: DelivraTheme.error, size: 20), const SizedBox(width: 8),
                            Expanded(child: Text(auth.error!, style: const TextStyle(color: DelivraTheme.error, fontSize: 13)))])),
                        const SizedBox(height: 16),
                      ],
                      TextFormField(controller: _emailCtrl, validator: FormValidators.email, keyboardType: TextInputType.emailAddress, textInputAction: TextInputAction.next,
                        decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined))),
                      const SizedBox(height: 16),
                      TextFormField(controller: _passwordCtrl, validator: FormValidators.password, obscureText: _obscure, textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _login(),
                        decoration: InputDecoration(labelText: 'Password', prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility), onPressed: () => setState(() => _obscure = !_obscure)))),
                      Align(alignment: Alignment.centerRight, child: TextButton(
                        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ForgotPasswordScreen())),
                        child: const Text('Forgot Password?', style: TextStyle(fontSize: 13)))),
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: auth.isLoading ? null : _login,
                        child: auth.isLoading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Sign In')),
                      const SizedBox(height: 16),
                      Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                        const Text('New to Delivra? ', style: TextStyle(color: DelivraTheme.textSecondary)),
                        GestureDetector(onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen())),
                          child: const Text('Sign Up', style: TextStyle(color: DelivraTheme.primary, fontWeight: FontWeight.w600))),
                      ]),
                    ]),
                  ),
                ),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}
