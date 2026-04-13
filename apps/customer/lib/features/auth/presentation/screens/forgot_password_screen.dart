import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../config/theme.dart';
import '../../../../core/widgets/form_validators.dart';
import '../../data/auth_repository.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});
  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _emailCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  final _newPassCtrl = TextEditingController();
  int _step = 0; // 0: enter email, 1: enter OTP, 2: new password, 3: success
  bool _loading = false;
  String? _error;

  Future<void> _sendOtp() async {
    if (FormValidators.email(_emailCtrl.text) != null) {
      setState(() => _error = 'Enter a valid email');
      return;
    }
    setState(() { _loading = true; _error = null; });
    final success = await ref.read(authProvider.notifier).forgotPassword(_emailCtrl.text.trim());
    setState(() { _loading = false; _step = success ? 1 : 0; _error = success ? null : 'Failed to send OTP'; });
  }

  Future<void> _verifyOtp() async {
    if (FormValidators.otp(_otpCtrl.text) != null) {
      setState(() => _error = 'Enter a valid 6-digit OTP');
      return;
    }
    setState(() { _loading = true; _error = null; });
    final success = await ref.read(authProvider.notifier).verifyOtp(_emailCtrl.text.trim(), _otpCtrl.text.trim());
    setState(() { _loading = false; _step = success ? 2 : 1; _error = success ? null : 'Invalid OTP'; });
  }

  @override
  void dispose() { _emailCtrl.dispose(); _otpCtrl.dispose(); _newPassCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset Password'), backgroundColor: Colors.white, foregroundColor: DelivraTheme.textPrimary, elevation: 0.5),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          // Progress indicator
          Row(children: List.generate(3, (i) => Expanded(
            child: Container(height: 4, margin: const EdgeInsets.symmetric(horizontal: 2),
              decoration: BoxDecoration(color: i <= _step ? DelivraTheme.primary : DelivraTheme.border, borderRadius: BorderRadius.circular(2))),
          ))),
          const SizedBox(height: 32),

          if (_error != null) ...[
            Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: DelivraTheme.error.withAlpha(25), borderRadius: BorderRadius.circular(10)),
              child: Text(_error!, style: const TextStyle(color: DelivraTheme.error, fontSize: 13))),
            const SizedBox(height: 16),
          ],

          // Step 0: Email
          if (_step == 0) ...[
            const Icon(Icons.lock_reset, size: 48, color: DelivraTheme.primary),
            const SizedBox(height: 16),
            const Text('Forgot Password?', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            const Text('Enter your email and we\'ll send you a verification code.', style: TextStyle(color: DelivraTheme.textSecondary)),
            const SizedBox(height: 24),
            TextFormField(controller: _emailCtrl, keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined))),
            const SizedBox(height: 24),
            ElevatedButton(onPressed: _loading ? null : _sendOtp,
              child: _loading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Send OTP')),
          ],

          // Step 1: OTP
          if (_step == 1) ...[
            const Icon(Icons.message, size: 48, color: DelivraTheme.primary),
            const SizedBox(height: 16),
            const Text('Enter Verification Code', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text('We sent a 6-digit code to ${_emailCtrl.text}', style: const TextStyle(color: DelivraTheme.textSecondary)),
            const SizedBox(height: 24),
            TextFormField(controller: _otpCtrl, keyboardType: TextInputType.number, maxLength: 6, textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, letterSpacing: 8),
              decoration: const InputDecoration(counterText: '', hintText: '000000')),
            const SizedBox(height: 24),
            ElevatedButton(onPressed: _loading ? null : _verifyOtp,
              child: _loading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Verify')),
            const SizedBox(height: 12),
            TextButton(onPressed: _sendOtp, child: const Text('Resend Code')),
          ],

          // Step 2: New password
          if (_step == 2) ...[
            const Icon(Icons.vpn_key, size: 48, color: DelivraTheme.primary),
            const SizedBox(height: 16),
            const Text('Create New Password', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
            const SizedBox(height: 24),
            TextFormField(controller: _newPassCtrl, obscureText: true,
              decoration: const InputDecoration(labelText: 'New Password', prefixIcon: Icon(Icons.lock_outline))),
            const SizedBox(height: 24),
            ElevatedButton(onPressed: () { setState(() => _step = 3); },
              child: const Text('Reset Password')),
          ],

          // Step 3: Success
          if (_step == 3) ...[
            const SizedBox(height: 40),
            const Icon(Icons.check_circle, size: 64, color: DelivraTheme.success),
            const SizedBox(height: 16),
            const Text('Password Reset!', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700), textAlign: TextAlign.center),
            const SizedBox(height: 8),
            const Text('You can now sign in with your new password.', style: TextStyle(color: DelivraTheme.textSecondary), textAlign: TextAlign.center),
            const SizedBox(height: 32),
            ElevatedButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Back to Sign In')),
          ],
        ]),
      ),
    );
  }
}
