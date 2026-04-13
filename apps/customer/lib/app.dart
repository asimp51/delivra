import 'package:flutter/material.dart';
import 'config/routes.dart';
import 'config/theme.dart';

class DelivraApp extends StatelessWidget {
  const DelivraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Delivra',
      debugShowCheckedModeBanner: false,
      theme: DelivraTheme.lightTheme,
      routerConfig: appRouter,
    );
  }
}
