import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../config/theme.dart';
import '../../../../core/widgets/form_validators.dart';
import '../../data/auth_repository.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});
  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscure = true;

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authProvider.notifier).register(
      email: _emailCtrl.text.trim(),
      password: _passwordCtrl.text,
      fullName: _nameCtrl.text.trim(),
      phone: _phoneCtrl.text.trim().isNotEmpty ? _phoneCtrl.text.trim() : null,
    );

    if (success && mounted) context.go('/');
  }

  @override
  void dispose() {
    _nameCtrl.dispose(); _emailCtrl.dispose(); _phoneCtrl.dispose();
    _passwordCtrl.dispose(); _confirmCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Create Account'), backgroundColor: Colors.white, foregroundColor: DelivraTheme.textPrimary, elevation: 0.5),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const Text('Join Delivra', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            const Text('Create your account to start ordering', style: TextStyle(color: DelivraTheme.textSecondary)),
            const SizedBox(height: 24),

            if (auth.error != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: DelivraTheme.error.withAlpha(25), borderRadius: BorderRadius.circular(10)),
                child: Text(auth.error!, style: const TextStyle(color: DelivraTheme.error, fontSize: 13)),
              ),
              const SizedBox(height: 16),
            ],

            TextFormField(controller: _nameCtrl, validator: FormValidators.name, textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person_outline))),
            const SizedBox(height: 16),

            TextFormField(controller: _emailCtrl, validator: FormValidators.email, keyboardType: TextInputType.emailAddress, textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined))),
            const SizedBox(height: 16),

            TextFormField(controller: _phoneCtrl, keyboardType: TextInputType.phone, textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Phone (optional)', prefixIcon: Icon(Icons.phone_outlined))),
            const SizedBox(height: 16),

            TextFormField(controller: _passwordCtrl, validator: FormValidators.password, obscureText: _obscure, textInputAction: TextInputAction.next,
              decoration: InputDecoration(labelText: 'Password', prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility), onPressed: () => setState(() => _obscure = !_obscure)))),
            const SizedBox(height: 16),

            TextFormField(controller: _confirmCtrl, validator: (v) => FormValidators.confirmPassword(v, _passwordCtrl.text), obscureText: true, textInputAction: TextInputAction.done,
              onFieldSubmitted: (_) => _register(),
              decoration: const InputDecoration(labelText: 'Confirm Password', prefixIcon: Icon(Icons.lock_outline))),
            const SizedBox(height: 24),

            ElevatedButton(
              onPressed: auth.isLoading ? null : _register,
              child: auth.isLoading
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Text('Create Account'),
            ),

            const SizedBox(height: 16),
            const Text('By signing up, you agree to our Terms of Service and Privacy Policy.',
              textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: DelivraTheme.textHint)),
          ]),
        ),
      ),
    );
  }
}
