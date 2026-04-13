import 'package:flutter/material.dart';
import 'config/theme.dart';
import 'config/routes.dart';

class DelivraVendorApp extends StatelessWidget {
  const DelivraVendorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Delivra Vendor',
      debugShowCheckedModeBanner: false,
      theme: VendorTheme.lightTheme,
      routerConfig: vendorRouter,
    );
  }
}
